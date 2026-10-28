import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
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
        data: { stage: 'QUALIFIED' }
      });

      // Log activity
      await tx.leadActivity.create({
        data: {
          leadId,
          actorId: lead.partnerId,
          activityType: 'STAGE_CHANGED',
          notes: 'Prospect verified and approved by Administrator.',
          channel: 'ADMIN_CONSOLE'
        }
      });

      // Notify the partner
      await tx.notification.create({
        data: {
          userId: lead.partnerId,
          type: 'LEAD_APPROVED',
          title: 'Prospect Approved! 🎉',
          message: `Your prospect "${lead.companyName}" has been verified and approved by Operations. You can now book discovery meetings!`
        }
      });

      return l;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error approving lead in admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to approve lead' },
      { status: 500 }
    );
  }
}
