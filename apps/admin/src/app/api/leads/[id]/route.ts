import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.leadActivity.deleteMany({ where: { leadId } });
      await tx.task.deleteMany({ where: { leadId } });
      await tx.meeting.deleteMany({ where: { leadId } });
      await tx.deal.deleteMany({ where: { leadId } });
      await tx.lead.delete({ where: { id: leadId } });
    });

    return NextResponse.json({
      success: true,
      message: `Lead "${lead.companyName}" was deleted successfully.`
    });
  } catch (error: any) {
    console.error('Error deleting lead in admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
