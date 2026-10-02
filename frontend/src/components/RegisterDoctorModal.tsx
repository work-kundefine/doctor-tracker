import React, { useState } from 'react';
import { api } from '../lib/api';

interface RegisterDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterDoctorModal: React.FC<RegisterDoctorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [titlePrefix, setTitlePrefix] = useState('Dr.');
  const [fullName, setFullName] = useState('');
  const [npiNumber, setNpiNumber] = useState('1049281044');
  const [primarySpecialty, setPrimarySpecialty] = useState('Cardiology');
  const [subSpecialty, setSubSpecialty] = useState('');
  const [campusAffiliation, setCampusAffiliation] = useState(
    'St. Jude Central Campus - Heart & Vascular Pavilion (Bldg B)'
  );
  const [roomLocation, setRoomLocation] = useState('Suite 410, Station C');
  const [physicianEmail, setPhysicianEmail] = useState('');
  const [physicianPhone, setPhysicianPhone] = useState('+1 (555) 382-9901');
  const [capacity, setCapacity] = useState(35);
  const [dutyStatus, setDutyStatus] = useState<'on_duty' | 'on_call' | 'off_duty'>('on_duty');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !npiNumber || !physicianEmail) {
      setErrorMsg('Please complete all required clinical fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.doctors.create({
        name: `${titlePrefix} ${fullName}`,
        titlePrefix,
        specialization: primarySpecialty,
        subSpecialty,
        hospital: campusAffiliation,
        suite: roomLocation,
        email: physicianEmail,
        phone: physicianPhone,
        npi: npiNumber,
        maxCaseload: capacity,
        dutyStatus,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to complete physician registration');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving doctor record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl my-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#c6c6cd]/30"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 bg-white flex items-start justify-between relative">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006a61] shrink-0 shadow-xs border border-[#c6c6cd]/25">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                badge
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0b1c30] tracking-tight">
                  Register New Physician
                </h2>
                <span className="bg-[#86f2e4]/30 text-[#006f66] px-2.5 py-0.5 rounded-full font-['Inter'] text-[11px] font-bold tracking-wide uppercase">
                  Provider Sync
                </span>
              </div>
              <p className="font-['Inter'] text-[12px] text-[#45464d] mt-0.5">
                Add a licensed medical practitioner to the hospital roster and initialize real-time NPI telemetry.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] hover:bg-[#dce9ff] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Accent Highlight Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#006a61] via-[#86f2e4] to-[#dce9ff]"></div>

        {/* Form Error */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] font-['Inter'] text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-160px)]">
          {/* SECTION 1: Primary Doctor Information */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[12px] uppercase tracking-wider text-[#006a61] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">id_card</span>
                1. Primary Doctor Information
              </span>
              <span className="font-['Inter'] text-[11px] text-[#45464d]">* Required clinical fields</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
              {/* Title Prefix */}
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Title Prefix <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] cursor-pointer appearance-none"
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Prof. Dr.">Prof. Dr.</option>
                    <option value="Assoc. Prof.">Assoc. Prof.</option>
                    <option value="Fellow">Fellow</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] pointer-events-none text-[18px]">
                    unfold_more
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div className="md:col-span-9 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Full Practitioner Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Lin, MD, FACC"
                    className="w-full h-10 px-4 bg-white text-[#0b1c30] placeholder:text-[#45464d]/60 font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    person
                  </span>
                </div>
              </div>

              {/* NPI Identifier */}
              <div className="md:col-span-6 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                    National Provider Identifier (NPI) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <span className="font-['Inter'] text-[11px] text-[#006a61] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">verified</span> CMS Validated
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    placeholder="10-digit NPI (e.g. 1049281044)"
                    className="w-full h-10 px-4 bg-white text-[#0b1c30] font-mono text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] tracking-wide"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#006a61] text-[18px]">
                    check_circle
                  </span>
                </div>
                <p className="font-['Inter'] text-[11px] text-[#45464d]">
                  Used as composite index key in hospital master registry.
                </p>
              </div>

              {/* Primary Specialization */}
              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Primary Specialization <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={primarySpecialty}
                    onChange={(e) => setPrimarySpecialty(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] cursor-pointer appearance-none"
                  >
                    <option value="Cardiology">Cardiology (Inpatient / Outpatient)</option>
                    <option value="Neurology">Neurology & Neurocritical Care</option>
                    <option value="Pediatrics">Pediatrics & Adolescent Medicine</option>
                    <option value="Orthopedics">Orthopedic Surgery</option>
                    <option value="Oncology">Medical Oncology & Hematology</option>
                    <option value="General Surgery">General & Bariatric Surgery</option>
                    <option value="Pulmonology">Pulmonology & Critical Care</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Sub-specialty */}
              <div className="md:col-span-12 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Sub-specialty / Clinical Sub-focus <span className="text-[#45464d] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={subSpecialty}
                  onChange={(e) => setSubSpecialty(e.target.value)}
                  placeholder="e.g. Interventional Cardiology, Structural Heart Disease, Electrophysiology"
                  className="w-full h-10 px-4 bg-white text-[#0b1c30] placeholder:text-[#45464d]/60 font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-[#c6c6cd]/25 w-full"></div>

          {/* SECTION 2: Institutional Affiliation & Contact */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[12px] uppercase tracking-wider text-[#006a61] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">domain</span>
                2. Institutional Affiliation & Contact
              </span>
              <span className="font-['Inter'] text-[11px] text-[#45464d]">Deployment & Routing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
              {/* Hospital Campus */}
              <div className="md:col-span-7 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Primary Campus / Hospital Division <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={campusAffiliation}
                    onChange={(e) => setCampusAffiliation(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] cursor-pointer appearance-none"
                  >
                    <option value="St. Jude Central Campus - Heart & Vascular Pavilion (Bldg B)">
                      St. Jude Central Campus — Heart & Vascular Pavilion (Bldg B)
                    </option>
                    <option value="St. Jude Central Campus - Main Tower">
                      St. Jude Central Campus — Main Inpatient Tower
                    </option>
                    <option value="Metro General Hospital">
                      Metro General Hospital — Acute Surgical Center
                    </option>
                    <option value="Westside Clinical Outpost">
                      Westside Ambulatory & Diagnostic Clinic
                    </option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#45464d] pointer-events-none text-[18px]">
                    domain
                  </span>
                </div>
              </div>

              {/* Suite Location */}
              <div className="md:col-span-5 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">Clinical Suite / Floor</label>
                <input
                  type="text"
                  value={roomLocation}
                  onChange={(e) => setRoomLocation(e.target.value)}
                  placeholder="e.g. Suite 410, Station C"
                  className="w-full h-10 px-4 bg-white text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                />
              </div>

              {/* Institutional Email Address */}
              <div className="md:col-span-7 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Institutional Email Address <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={physicianEmail}
                    onChange={(e) => setPhysicianEmail(e.target.value)}
                    placeholder="s.lin@stjude-health.org"
                    className="w-full h-10 pl-9 pr-4 bg-white text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    alternate_email
                  </span>
                </div>
                <span className="font-['Inter'] text-[11px] text-[#45464d]">
                  SSO invite & emergency pager dispatch will be triggered.
                </span>
              </div>

              {/* Direct Pager Phone */}
              <div className="md:col-span-5 flex flex-col gap-1">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Direct Pager / Office Phone <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={physicianPhone}
                    onChange={(e) => setPhysicianPhone(e.target.value)}
                    placeholder="+1 (555) 382-9901"
                    className="w-full h-10 pl-9 pr-4 bg-white text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl border border-[#c6c6cd] shadow-xs focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61]"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                    call
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#c6c6cd]/25 w-full"></div>

          {/* SECTION 3: Caseload Capacity & Telemetry Settings */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[12px] uppercase tracking-wider text-[#006a61] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                3. Caseload & Onboarding Settings
              </span>
              <span className="font-['Inter'] text-[11px] text-[#45464d]">Operational Limits</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
              {/* Patient Capacity Stepper / Threshold */}
              <div className="md:col-span-6 bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-1.5 border border-[#c6c6cd]/25">
                <div className="flex items-center justify-between">
                  <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                    Max Patient Concurrent Load
                  </label>
                  <span className="font-['Inter'] text-[14px] text-[#006a61] font-bold px-2.5 py-0.5 rounded-lg bg-white shadow-xs">
                    {capacity} pts
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full accent-[#006a61] cursor-pointer mt-1"
                />
                <div className="flex justify-between font-['Inter'] text-[11px] text-[#45464d]">
                  <span>10 (Low-density)</span>
                  <span>35 (Standard)</span>
                  <span>60 (Surge alert)</span>
                </div>
              </div>

              {/* Initial Shift Schedule / Duty Status */}
              <div className="md:col-span-6 bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-2 border border-[#c6c6cd]/25">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Initial Duty Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDutyStatus('on_duty')}
                    className={`p-2 rounded-lg font-['Inter'] text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                      dutyStatus === 'on_duty'
                        ? 'bg-[#86f2e4]/30 border-[#006a61] text-[#006a61]'
                        : 'bg-white border-[#c6c6cd]/30 text-[#0b1c30]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#006a61]"></span>
                    <span>On-Duty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDutyStatus('on_call')}
                    className={`p-2 rounded-lg font-['Inter'] text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                      dutyStatus === 'on_call'
                        ? 'bg-[#dce9ff] border-[#188ace] text-[#188ace]'
                        : 'bg-white border-[#c6c6cd]/30 text-[#0b1c30]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#188ace]"></span>
                    <span>On-Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDutyStatus('off_duty')}
                    className={`p-2 rounded-lg font-['Inter'] text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                      dutyStatus === 'off_duty'
                        ? 'bg-gray-200 border-gray-400 text-gray-800'
                        : 'bg-white border-[#c6c6cd]/30 text-[#0b1c30]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#76777d]"></span>
                    <span>Off-Duty</span>
                  </button>
                </div>
              </div>

              {/* Synchronization Options */}
              <div className="md:col-span-12 bg-[#eff4ff]/60 p-4 rounded-xl flex items-start gap-3 border border-[#c6c6cd]/25">
                <input
                  type="checkbox"
                  defaultChecked
                  id="ehrSync"
                  className="mt-1 w-4 h-4 rounded text-[#006a61] focus:ring-[#006a61] accent-[#006a61] cursor-pointer"
                />
                <div className="flex flex-col">
                  <label htmlFor="ehrSync" className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold cursor-pointer">
                    Provision MongoDB read/write telemetry & automatic Epic/Cerner EHR synchronization
                  </label>
                  <p className="font-['Inter'] text-[11px] text-[#45464d] mt-0.5">
                    Creates bidirectional CDC stream on collection <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-[#c6c6cd]/30">physician_roster</code> and assigns encrypted HIPAA audit tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Inside Form */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#c6c6cd]/25">
            {/* Telemetry Index Spec Badge */}
            <div className="flex items-center gap-2 text-[#45464d] font-['Inter'] text-[11px]">
              <div className="flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1 rounded-md border border-[#c6c6cd]/30">
                <span className="material-symbols-outlined text-[#006a61] text-[16px]">database</span>
                <span className="font-mono text-[10px] text-[#0b1c30] font-medium">INDEX {'{ npi: 1, hospital_id: 1 }'}</span>
              </div>
              <span className="hidden md:inline font-mono text-[10px] text-[#006a61] font-bold">
                • p99 write &lt; 20ms
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl font-['Inter'] text-[13px] text-white bg-[#000000] hover:bg-[#131b2e] transition-all flex items-center gap-2 shadow-md font-semibold cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                )}
                <span>Complete Registration</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
