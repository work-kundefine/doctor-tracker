import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface AdmitPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetDoctor?: any;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetDoctor,
}) => {
  const [patientName, setPatientName] = useState('Eleanor Marie Vance');
  const [mrn, setMrn] = useState('MRN-84921-CV');
  const [dob, setDob] = useState('1978-04-12');
  const [age, setAge] = useState(46);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [condition, setCondition] = useState<
    'Critical Care' | 'Post-Operative' | 'Chronic Management' | 'Stable' | 'Routine Observation'
  >('Post-Operative');
  const [diagnosis, setDiagnosis] = useState(
    'Acute ST-Elevation Myocardial Infarction (STEMI) — Transfer from Cath Lab post-PCI stenting (LAD artery). Continuous hemodynamic telemetry required.'
  );
  const [ward, setWard] = useState('Central Wing');
  const [roomBed, setRoomBed] = useState('Room 304, Bed A (Telemetry Ready)');
  const [contactName, setContactName] = useState('David Vance');
  const [contactRelation, setContactRelation] = useState('Spouse / Health Proxy');
  const [contactPhone, setContactPhone] = useState('+1 (555) 492-1092');
  const [telemetryAlert, setTelemetryAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default to Dr. Robert Vance if no specific doctor selected
  const doc = targetDoctor || {
    id: '66fa19b2e401010101010101',
    _id: '66fa19b2e401010101010101',
    name: 'Dr. Robert Vance, MD',
    specialization: 'Cardiology',
    hospital: 'St. Jude Central Campus',
    npi: '9481029',
    maxCaseload: 40,
    patientCount: 34,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
  };

  useEffect(() => {
    // Generate a fresh MRN if opened
    if (isOpen) {
      const code = Math.floor(10000 + Math.random() * 90000);
      setMrn(`MRN-${code}-${doc.specialization.substring(0, 2).toUpperCase()}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !diagnosis) {
      setErrorMsg('Please complete mandatory patient fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.doctors.addPatient(doc.id || doc._id, {
        name: patientName,
        mrn,
        dob,
        age,
        gender,
        condition,
        diagnosis,
        ward,
        roomBed,
        emergencyContact: {
          name: contactName,
          relation: contactRelation,
          phone: contactPhone,
        },
        immediateAlert: telemetryAlert,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to admit patient');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing direct admission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadPercentage = Math.round(((doc.patientCount || 34) / (doc.maxCaseload || 40)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-auto overflow-hidden border border-[#c6c6cd]/30"
        role="dialog"
      >
        {/* Top Clinical Accent Bar */}
        <div className="h-1.5 w-full bg-[#006a61]"></div>

        {/* Header Section */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4 bg-white">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006a61] shrink-0 shadow-xs border border-[#c6c6cd]/25">
              <span className="material-symbols-outlined text-[26px]">assignment_ind</span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30] tracking-tight">
                  Assign & Admit New Patient
                </h1>
                <span className="bg-[#86f2e4]/30 text-[#006f66] px-2.5 py-0.5 rounded-full font-['Inter'] text-[11px] font-bold uppercase tracking-wider">
                  Doctor Direct Assign
                </span>
              </div>
              <p className="font-['Inter'] text-[12px] text-[#45464d] leading-relaxed">
                Admit an inpatient directly under {doc.name}'s clinical custody with real-time bed telemetry and EHR sync.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#45464d] hover:text-[#0b1c30] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Physician Summary Strip */}
        <div className="mx-6 p-4 rounded-xl bg-[#eff4ff] border border-[#c6c6cd]/25 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {doc.avatarUrl ? (
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-11 h-11 rounded-full object-cover shadow-xs border border-[#c6c6cd]/30"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center font-bold text-[14px]">
                    MD
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#006a61] flex items-center justify-center ring-2 ring-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Inter'] text-[14px] font-bold text-[#0b1c30]">{doc.name}</span>
                  <span className="font-['Inter'] text-[12px] text-[#45464d] font-mono">• NPI: {doc.npi}</span>
                </div>
                <div className="font-['Inter'] text-[12px] text-[#006a61] font-medium">
                  {doc.specialization} • Inpatient Pavilion, Bldg B
                </div>
              </div>
            </div>

            {/* Capacity Gauge Micro-Widget */}
            <div className="sm:text-right min-w-[190px]">
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="font-['Inter'] text-[11px] text-[#45464d]">Active Load:</span>
                <span className="font-['Inter'] text-[12px] text-[#0b1c30] font-bold tabular-nums">
                  {doc.patientCount || 34} / {doc.maxCaseload || 40} Beds ({loadPercentage}%)
                </span>
              </div>
              <div className="w-full bg-[#dce9ff] h-2 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#006a61] h-full rounded-full transition-all duration-500"
                  style={{ width: `${loadPercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                <span className="font-['Inter'] text-[11px] text-[#006a61] font-semibold">
                  {Math.max(1, (doc.maxCaseload || 40) - (doc.patientCount || 34))} Direct Slots Remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] font-['Inter'] text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Admission Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(88vh-240px)] overflow-y-auto">
          {/* SECTION 1: Patient Demographics & Record Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-['Inter'] text-[12px] font-bold uppercase tracking-wider text-[#0b1c30]">
                  1. Demographics & Patient Index
                </span>
                <span className="text-[#ba1a1a] font-bold text-[12px]">*</span>
              </div>
              <span className="bg-[#eff4ff] text-[#006a61] px-2.5 py-0.5 rounded font-mono text-[11px] font-semibold border border-[#c6c6cd]/25">
                MongoDB ObjectID: 66fa19b2e4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] flex items-center justify-between font-semibold">
                  <span>Full Legal Name</span>
                  <span className="font-['Inter'] text-[11px] text-[#006a61]">Verified Record</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] shadow-xs border border-[#c6c6cd] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                </div>
              </div>

              <div className="sm:col-span-5 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">
                  Medical Record No. (MRN)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={mrn}
                    className="w-full px-3 py-2 bg-[#eff4ff] rounded-xl font-mono text-[13px] text-[#0b1c30] font-semibold select-all focus:outline-none border border-[#c6c6cd]/30"
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#006a61] text-[18px]">
                    check_circle
                  </span>
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">
                  Date of Birth & Age
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    calendar_today
                  </span>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      const yr = new Date(e.target.value).getFullYear();
                      if (!isNaN(yr)) setAge(new Date().getFullYear() - yr);
                    }}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] shadow-xs border border-[#c6c6cd] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Biological Sex</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setGender(s)}
                      className={`py-2 px-1 rounded-xl text-center font-['Inter'] text-[12px] font-semibold transition-colors cursor-pointer border ${
                        gender === s
                          ? 'bg-[#006a61] text-white border-[#006a61] shadow-xs'
                          : 'bg-[#eff4ff] text-[#45464d] border-[#c6c6cd]/30 hover:bg-[#e5eeff]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Clinical Acuity & Triage Band */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[12px] font-bold uppercase tracking-wider text-[#0b1c30]">
                2. Clinical Acuity & Triage Band
              </span>
              <span className="font-['Inter'] text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">vital_signs</span> Priority Routing
              </span>
            </div>

            {/* Segmented Triage Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 'Critical Care', label: 'Critical (ICU)', dot: '#ba1a1a', activeBg: 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]' },
                { val: 'Post-Operative', label: 'Post-Operative', dot: '#006a61', activeBg: 'bg-[#86f2e4]/30 text-[#006f66] border-[#006a61]' },
                { val: 'Chronic Management', label: 'Chronic Care', dot: '#131b2e', activeBg: 'bg-[#dce9ff] text-[#0b1c30] border-[#188ace]' },
                { val: 'Routine Observation', label: 'Observation', dot: '#76777d', activeBg: 'bg-[#eff4ff] text-[#0b1c30] border-gray-400' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setCondition(item.val as any)}
                  className={`p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center space-y-1 cursor-pointer ${
                    condition === item.val
                      ? `${item.activeBg} font-bold shadow-xs`
                      : 'bg-[#eff4ff] border-[#c6c6cd]/25 text-[#45464d] hover:bg-[#e5eeff]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.dot }}></span>
                  <span className="font-['Inter'] text-[12px]">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold flex items-center justify-between">
                <span>Primary Working Diagnosis & Intervention Plan</span>
                <span className="font-['Inter'] text-[11px] text-[#45464d]">ICD-10 Sync Enabled</span>
              </label>
              <textarea
                rows={2}
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-3 bg-white rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] shadow-xs border border-[#c6c6cd] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] resize-none"
              ></textarea>
            </div>
          </div>

          {/* SECTION 3: Ward & Bed Assignment */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[12px] font-bold uppercase tracking-wider text-[#0b1c30]">
                3. Ward & Bed Assignment
              </span>
              <span className="font-['Inter'] text-[11px] text-[#006a61] font-medium">Bldg B • Telemetry Floor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-12 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Department / Pavilion</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#006a61] text-[18px]">
                    domain
                  </span>
                  <input
                    type="text"
                    readOnly
                    value="Heart & Vascular Institute — St. Jude Central Campus"
                    className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] font-semibold select-none focus:outline-none border border-[#c6c6cd]/30"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Assigned Room & Bed Slot</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    single_bed
                  </span>
                  <select
                    value={roomBed}
                    onChange={(e) => setRoomBed(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] shadow-xs border border-[#c6c6cd] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] appearance-none cursor-pointer"
                  >
                    <option value="Room 304, Bed A (Telemetry Ready)">
                      Wing B — Room 304, Bed A (Telemetry Ready)
                    </option>
                    <option value="Room 306, Bed B (Telemetry Ready)">
                      Wing B — Room 306, Bed B (Telemetry Ready)
                    </option>
                    <option value="Room 311, Bed A (Step-down ICU)">
                      Wing B — Room 311, Bed A (Step-down ICU)
                    </option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Admission Duration</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    date_range
                  </span>
                  <input
                    type="text"
                    readOnly
                    value="Oct 25 (Today) → Oct 29 (Est. 4 Days)"
                    className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] border border-[#c6c6cd]/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Emergency Point of Contact */}
          <div className="space-y-3 pt-1">
            <span className="font-['Inter'] text-[12px] font-bold uppercase tracking-wider text-[#0b1c30]">
              4. Primary Emergency Point of Contact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">
                  Designated Contact & Relation
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    contact_phone
                  </span>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="David Vance (Spouse / Health Proxy)"
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] shadow-xs border border-[#c6c6cd] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-['Inter'] text-[12px] text-[#45464d] font-semibold">Verified Contact Phone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    call
                  </span>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 492-1092"
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl font-mono text-[13px] text-[#0b1c30] shadow-xs border border-[#c6c6cd] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                </div>
              </div>
            </div>

            {/* Telemetry Alert Toggle */}
            <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between gap-3 border border-[#c6c6cd]/25">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={telemetryAlert}
                  onChange={(e) => setTelemetryAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006a61] focus:ring-0 accent-[#006a61] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-[12px] text-[#0b1c30] font-bold">
                    Immediate Physician Telemetry Alert
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#45464d]">
                    Dispatch direct push notification and EHR alert to {doc.name}'s active pager device.
                  </span>
                </div>
              </label>
              <span className="material-symbols-outlined text-[#006a61] text-[22px] shrink-0">emergency</span>
            </div>
          </div>

          {/* Modal Footer Inside Form */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#c6c6cd]/25">
            {/* Live Cluster Telemetry Trace */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#45464d]">
              <span className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
              <span>MongoDB: <code className="font-semibold text-[#0b1c30]">db.doctors.updateOne({'{'} NPI: {doc.npi} {'}'})</code></span>
              <span className="text-[#006a61] font-bold">• 11ms latency</span>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[13px] font-semibold transition-all cursor-pointer border border-[#c6c6cd]/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#000000] hover:bg-[#131b2e] text-white font-['Inter'] text-[13px] font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                )}
                <span>Admit & Assign Patient</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
