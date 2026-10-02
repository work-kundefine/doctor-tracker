import React from 'react';

interface PatientTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export const PatientTimelineDrawer: React.FC<PatientTimelineDrawerProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  if (!isOpen || !patient) return null;

  const defaultTimeline = [
    {
      date: 'Today, 08:30 AM',
      title: 'Morning Rounds & Arterial Gas Check',
      description: 'Vitals stable under 2L supplemental O2. Mean arterial pressure maintained > 65 mmHg.',
      dotColor: '#006a61',
    },
    {
      date: 'Yesterday, 14:15 PM',
      title: `Consultation: ${patient.doctorName || 'Dr. Robert Vance'}`,
      description: 'Diagnostic assessment completed. Physiological parameters verified within target parameters.',
      dotColor: '#188ace',
    },
    {
      date: 'Oct 12, 2024 - 03:10 AM',
      title: 'Emergency Triage Admission',
      description: `Patient arrived under clinical monitoring. Ward custody allocated to ${patient.ward || 'Central Wing'} (${patient.roomBed || 'Room 304'}).`,
      dotColor: '#ba1a1a',
    },
  ];

  const events = patient.timeline && patient.timeline.length > 0
    ? patient.timeline.map((t: any) => ({
        date: new Date(t.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        title: t.title,
        description: t.description,
        dotColor: t.category === 'triage' ? '#ba1a1a' : t.category === 'procedure' ? '#006a61' : '#188ace',
      }))
    : defaultTimeline;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs z-50 transition-opacity"
      ></div>
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto border-l border-[#c6c6cd]/30 animate-in slide-in-from-right duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#c6c6cd]/25">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0b1c30]">
                Patient Timeline
              </h3>
              <p className="font-['Inter'] text-[12px] text-[#006a61] font-semibold mt-0.5">
                {patient.name} • #{patient.mrn}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Timeline List */}
          <div className="relative pl-6 space-y-6 mt-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dce9ff]">
            {events.map((ev: any, idx: number) => (
              <div key={idx} className="relative">
                <span
                  className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full ring-4 ring-white"
                  style={{ backgroundColor: ev.dotColor || '#006a61' }}
                ></span>
                <span className="font-['Inter'] text-[11px] text-[#45464d] font-medium">{ev.date}</span>
                <h4 className="font-['Inter'] text-[14px] font-bold text-[#0b1c30] mt-0.5">
                  {ev.title}
                </h4>
                <p className="font-['Inter'] text-[12px] text-[#45464d] mt-1 leading-relaxed">
                  {ev.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-[#c6c6cd]/25">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-['Inter'] text-[13px] rounded-xl font-semibold transition-colors cursor-pointer border border-[#c6c6cd]/30"
          >
            Close Timeline
          </button>
        </div>
      </aside>
    </>
  );
};
