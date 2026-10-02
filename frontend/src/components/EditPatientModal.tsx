import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient: any;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patient,
}) => {
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [condition, setCondition] = useState<
    'Critical Care' | 'Post-Operative' | 'Chronic Management' | 'Stable' | 'Routine Observation'
  >('Critical Care');
  const [doctorId, setDoctorId] = useState('');
  const [ward, setWard] = useState('');
  const [roomBed, setRoomBed] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setPatientName(patient.name || '');
      setDob(patient.dob || 'Oct 12, 1978');
      setGender(patient.gender || 'Female');
      setCondition(patient.condition || 'Critical Care');
      setDoctorId(patient.doctorId || patient.doctorName || 'Dr. Robert Vance');
      setWard(patient.ward || 'Central Wing');
      setRoomBed(patient.roomBed || 'Room 304');
      setPhone(patient.emergencyContact?.phone || '+1 (555) 492-1092');
      setNotes(patient.notes || '');
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.patients.update(patient.id || patient._id, {
        name: patientName,
        dob,
        gender,
        condition,
        doctorId,
        ward,
        roomBed,
        emergencyContact: {
          name: patient.emergencyContact?.name || 'Emergency Contact',
          relation: patient.emergencyContact?.relation || 'Spouse',
          phone,
        },
        notes,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        alert(res.message || 'Failed to update patient');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#c6c6cd]/30">
        {/* Modal Header */}
        <div className="p-6 bg-[#eff4ff] flex items-center justify-between border-b border-[#c6c6cd]/25">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61] text-[22px]">clinical_notes</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] text-[#0b1c30] font-bold">
                Edit Patient Details
              </h2>
            </div>
            <p className="font-['Inter'] text-[12px] text-[#45464d] mt-0.5">
              Record ID: #{patient.mrn} • Central Electronic Health Record (EHR)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Full Patient Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Date of Birth
              </label>
              <input
                type="text"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="e.g. Oct 12, 1978"
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Biological Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30 cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Non-Binary / Other</option>
              </select>
            </div>

            {/* Condition Status */}
            <div>
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Condition Status
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30 cursor-pointer"
              >
                <option value="Critical Care">Critical Care (ICU / Emergency)</option>
                <option value="Post-Operative">Post-Operative</option>
                <option value="Chronic Management">Chronic Management</option>
                <option value="Stable">Stable</option>
                <option value="Routine Observation">Routine Observation</option>
              </select>
            </div>

            {/* Reassign Doctor */}
            <div>
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Reassign Primary Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30 cursor-pointer"
              >
                <option value="Dr. Robert Vance">Dr. Robert Vance (Cardiology)</option>
                <option value="Dr. Elena Rostova">Dr. Elena Rostova (Surgery / Neuro)</option>
                <option value="Dr. Michael Chang">Dr. Michael Chang (Pulmonology)</option>
                <option value="Dr. Amara Okafor">Dr. Amara Okafor (Internal Med)</option>
                <option value="Dr. Julian Ross">Dr. Julian Ross (Neurology)</option>
              </select>
            </div>

            {/* Hospital Ward & Bed */}
            <div>
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Hospital Ward / Bed Number
              </label>
              <input
                type="text"
                required
                value={`${ward} - ${roomBed}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  setWard(parts[0]?.trim() || 'Central Wing');
                  setRoomBed(parts[1]?.trim() || 'Room 304');
                }}
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
              />
            </div>

            {/* Contact Phone */}
            <div className="sm:col-span-2">
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 h-10 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block font-['Inter'] text-[12px] text-[#0b1c30] font-semibold mb-1">
                Clinical Progress Notes & Directives
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-[#eff4ff] rounded-xl font-['Inter'] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#006a61] border border-[#c6c6cd]/30 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c6c6cd]/25">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[13px] font-semibold rounded-xl transition-colors cursor-pointer border border-[#c6c6cd]/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 h-10 bg-[#006a61] hover:bg-[#005049] text-white font-['Inter'] text-[13px] font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? 'Synchronizing...' : 'Save Patient Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
