export default function AuthLayout({ children }) {
  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-200 to-emerald-50 border border-emerald-100 shadow-sm overflow-hidden p-4 sm:p-8 lg:p-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[20px] bg-emerald-700 text-white font-extrabold text-xl sm:text-2xl shadow-sm">
              H+
            </div>
            <div>
              <span className="block text-sm sm:text-base font-bold tracking-wide text-emerald-950 uppercase">
                Home Healthcare Services Company
              </span>
              <span className="block text-xs sm:text-[15px] text-emerald-800 font-medium mt-0.5">
                Secure care management portal
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-20 items-center">
          <section>
            <div className="mb-8 sm:mb-12">
              <p className="text-xs font-bold tracking-widest text-teal-800 uppercase mb-3 sm:mb-4">
                Patient Care Starts Here
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 mb-3 sm:mb-6">
                Manage home healthcare access with confidence.
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-md">
                A clean and secure portal for care teams, coordinators, and administrators.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "24/7", text: "Care access" },
                { title: "JWT", text: "Secure login" },
                { title: "Role", text: "Based access" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col items-center text-center rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-900/20"
                >
                  <span className="text-lg sm:text-xl font-bold text-emerald-600 mb-1">
                    {card.title}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {card.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* This is where the right-side form content goes */}
          {children}
        </div>
      </div>
    </div>
  );
}
