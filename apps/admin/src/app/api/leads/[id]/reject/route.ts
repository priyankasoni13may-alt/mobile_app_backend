import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
    const body = await request.json().catch(() => ({}));
    const reason = body?.reason || 'Does not match qualification criteria';

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { partner: true }
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const l = await tx.lead.update({
        where: { id: leadId },
        data: {
          stage: 'UNQUALIFIED',
          unqualifiedReason: reason
        }
      });

      // Log activity
      await tx.leadActivity.create({
        data: {
          leadId,
          actorId: lead.partnerId,
          activityType: 'STAGE_CHANGED',
          notes: `Prospect unverified/rejected by Operations. Reason: ${reason}`,
          channel: 'ADMIN_CONSOLE'
        }
      });

      // Notify the partner
      await tx.notification.create({
        data: {
          userId: lead.partnerId,
          type: 'LEAD_REJECTED',
          title: 'Prospect Update',
          message: `Your prospect "${lead.companyName}" was marked unqualified. Reason: ${reason}.`
        }
      });

      return l;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error rejecting lead in admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reject lead' },
      { status: 500 }
    );
  }
}
