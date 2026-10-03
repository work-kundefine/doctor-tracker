import mongoose from 'mongoose';
import { DoctorModel } from '../models/Doctor.model';
import { PatientModel } from '../models/Patient.model';
import { memoryStore } from './doctor.service';

export class AnalyticsService {
  async getOverviewMetrics() {
    let totalDoctors = memoryStore.doctors.length;
    let totalPatients = memoryStore.patients.length;

    if (mongoose.connection.readyState === 1) {
      try {
        const [dCount, pCount] = await Promise.all([
          DoctorModel.countDocuments(),
          PatientModel.countDocuments(),
        ]);
        totalDoctors = dCount || totalDoctors;
        totalPatients = pCount || totalPatients;
      } catch (e) {}
    }

    const displayDoctors = totalDoctors;
    const displayPatients = totalPatients;
    const avgRatio = displayDoctors > 0 ? Number((displayPatients / displayDoctors).toFixed(1)) : 0;

    return {
      totalDoctors: displayDoctors,
      doctorsGrowth: displayDoctors > 0 ? `${displayDoctors} active` : '0 active',
      totalPatients: displayPatients,
      patientsGrowth: displayPatients > 0 ? `${displayPatients} admitted` : '0 admitted',
      avgRatio,
      ratioTarget: 'Target: balanced load',
      ratioStatus: 'Active',
      aggregationLatencyMs: 5,
      latencyStatus: 'Healthy',
      clusterName: 'Primary Cluster',
      mongoStatus: 'Live',
    };
  }

  async getIntakeTrends(range: '7D' | '30D' | '3M' | '1Y' = '30D') {
    const labels: string[] = [];
    const admissions: number[] = [];
    const discharges: number[] = [];
    const physiciansActive: number[] = [];

    if (range === '30D') {
      labels.push('Oct 01', 'Oct 06', 'Oct 11', 'Oct 16', 'Oct 21', 'Oct 25');
      admissions.push(110, 125, 138, 142, 148, 155);
      discharges.push(95, 115, 108, 122, 118, 128);
      physiciansActive.push(120, 124, 128, 130, 134, 136);
    } else if (range === '7D') {
      labels.push('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
      admissions.push(130, 142, 138, 150, 148, 112, 105);
      discharges.push(115, 120, 132, 128, 140, 98, 92);
      physiciansActive.push(130, 132, 134, 135, 134, 120, 118);
    } else if (range === '3M') {
      labels.push('Aug W1', 'Aug W3', 'Sep W1', 'Sep W3', 'Oct W1', 'Oct W3');
      admissions.push(650, 680, 720, 740, 810, 830);
      discharges.push(610, 640, 690, 710, 760, 790);
      physiciansActive.push(125, 128, 130, 132, 134, 136);
    } else {
      labels.push('Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep');
      admissions.push(2800, 3100, 3250, 3400, 3600, 3840);
      discharges.push(2650, 2900, 3050, 3200, 3450, 3680);
      physiciansActive.push(115, 120, 125, 130, 136, 142);
    }

    return {
      range,
      labels,
      admissions,
      discharges,
      physiciansActive,
      admissionsAvg: '124/day',
      dischargesAvg: '112/day',
      peakPhysicians: '132 Peak',
      selectedPoint: {
        date: 'Oct 21, 2024',
        admissions: 148,
        discharges: 118,
        physicians: 134,
      },
    };
  }

  async getSpecialtyBreakdown() {
    const breakdown = [
      { specialty: 'Cardiology', doctors: 40, percentage: 28, color: '#006a61' },
      { specialty: 'Neurology', doctors: 31, percentage: 22, color: '#188ace' },
      { specialty: 'Pediatrics', doctors: 27, percentage: 19, color: '#86f2e4' },
      { specialty: 'Orthopedics', doctors: 23, percentage: 16, color: '#565e74' },
      { specialty: 'Oncology', doctors: 21, percentage: 15, color: '#bec6e0' },
    ];

    return {
      totalStaff: 142,
      wingsCount: 5,
      breakdown,
    };
  }

  async getWorkloadAndCapacity() {
    const list = [
      {
        id: '66fa19b2e401010101010103',
        name: 'Dr. Marcus Chen',
        npi: '184920411',
        specialty: 'Cardiology',
        assigned: 34,
        maxCapacity: 40,
        loadPercentage: 88,
        status: 'Near Capacity',
        avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
      },
      {
        id: '66fa19b2e401010101010102',
        name: 'Dr. Elena Rostova',
        npi: '104829103',
        specialty: 'Neurology',
        assigned: 26,
        maxCapacity: 40,
        loadPercentage: 65,
        status: 'Accepting',
        avatarUrl: 'https://images.unsplash.com/photo-1594824813639-4507c6f082e6?auto=format&fit=crop&q=80&w=300',
      },
      {
        id: '66fa19b2e401010101010108',
        name: 'Dr. Jordan Taylor',
        npi: '199384022',
        specialty: 'Pediatrics',
        assigned: 19,
        maxCapacity: 40,
        loadPercentage: 47,
        status: 'Accepting',
        avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300',
      },
      {
        id: '66fa19b2e401010101010104',
        name: 'Dr. David Kim',
        npi: '147294819',
        specialty: 'Orthopedics',
        assigned: 37,
        maxCapacity: 40,
        loadPercentage: 92,
        status: 'Near Capacity',
        avatarUrl: '',
        initials: 'DK',
      },
    ];

    return {
      workloads: list,
      showingCount: 4,
      totalCount: 142,
    };
  }

  async getRecentAdmissions() {
    const feed = [
      {
        id: 'adm-1',
        patientName: 'Alonzo Reyes',
        mrn: 'MRN-92810',
        doctorName: 'Dr. Marcus Chen',
        triageTag: 'Critical Cardiac',
        severity: 'critical',
        timeAgo: '2m ago',
      },
      {
        id: 'adm-2',
        patientName: 'Clara Vance',
        mrn: 'MRN-84729',
        doctorName: 'Dr. Jordan Taylor',
        triageTag: 'Routine Pediatric',
        severity: 'routine',
        timeAgo: '14m ago',
      },
      {
        id: 'adm-3',
        patientName: 'Geraldine Novak',
        mrn: 'MRN-78392',
        doctorName: 'Dr. Elena Rostova',
        triageTag: 'Stable Neuro Post-Op',
        severity: 'stable',
        timeAgo: '28m ago',
      },
      {
        id: 'adm-4',
        patientName: 'Arthur Pendelton',
        mrn: 'MRN-65829',
        doctorName: 'Dr. David Kim',
        triageTag: 'Ortho Inpatient',
        severity: 'inpatient',
        timeAgo: '42m ago',
      },
    ];

    return {
      admissions: feed,
      queueCount: 3,
      wsConnected: true,
    };
  }
}

export const analyticsService = new AnalyticsService();
