import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const search = searchParams.get('search');

    const where: any = {};
    if (stage && stage !== 'ALL') {
      where.stage = stage;
    }
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { companyWebsite: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [leads, conflicts] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          partner: { select: { id: true, fullName: true, email: true, phone: true } },
          owner: { select: { id: true, fullName: true, email: true } },
          businessUnit: { select: { id: true, name: true } },
          activities: { orderBy: { happenedAt: 'desc' }, take: 1 }
        }
      }),
      prisma.leadClaimConflict.findMany({
        where: { decision: 'PENDING' },
        include: {
          existingLead: { select: { companyName: true, companyWebsite: true } }
        }
      })
    ]);

    const formattedLeads = leads.map((l) => ({
      id: l.id,
      companyName: l.companyName,
      companyWebsite: l.companyWebsite || '',
      businessUnit: l.businessUnit?.name || 'Lumora Solutions',
      contactName: l.contactName,
      contactRole: l.contactRole || 'Key Stakeholder',
      contactEmail: l.contactEmail || '',
      contactPhone: l.contactPhone || '',
      partnerName: l.partner?.fullName || 'Unknown Partner',
      partnerEmail: l.partner?.email || '',
      partnerPhone: l.partner?.phone || '',
      ownerName: l.owner?.fullName || 'Unassigned',
      needSummary: l.needSummary || '',
      consentBasis: l.consentBasis || '',
      serviceInterest: l.serviceInterest || '',
      stage: l.stage,
      unqualifiedReason: l.unqualifiedReason,
      createdAt: l.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: formattedLeads,
      conflicts
    });
  } catch (error: any) {
    console.error('Error fetching leads in admin API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
