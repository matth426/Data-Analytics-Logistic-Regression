import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Download, Layers, MonitorPlay } from 'lucide-react';
import {
  LEARNING_OBJECTIVES,
  MODULE_START_SLIDE,
  SLIDES,
  type SlideMeta,
} from './data/lectureData';
import {
  Slide1Title,
  Slide2Objectives,
  Slide3WarmUp,
  Slide4WhyNotLinear,
  Slide5Sigmoid,
  Slide6OddsRatios,
} from './components/slides/FoundationsSlides';
import {
  Slide7PracticeDataset,
  Slide8ManualComputation,
  Slide9FittingIRLS,
  Slide10Sklearn,
  Slide11Statsmodels,
  Slide12Evaluation,
  Slide13PitfallsRecap,
} from './components/slides/HandsOnAndPythonSlides';

const SECTIONS: SlideMeta['section'][] = [
  'Foundations',
  'Math & Odds',
  'By Hand',
  'Python',
  'Evaluation',
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'deck' | 'all'>('deck');
  const [checkedObjectives, setCheckedObjectives] = useState<boolean[]>(() =>
    LEARNING_OBJECTIVES.map(() => false)
  );
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(
    () => new Set([1])
  );

  const markSlideComplete = useCallback((slideId: number) => {
    setCompletedSlides((prev) => {
      if (prev.has(slideId)) return prev;
      const next = new Set(prev);
      next.add(slideId);
      return next;
    });
  }, []);

  const goToSlide = useCallback(
    (slideId: number) => {
      const clamped = Math.min(Math.max(slideId, 1), SLIDES.length);
      if (viewMode === 'all') {
        const el = document.getElementById(`lecture-slide-${clamped}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setCurrentSlide(clamped);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      markSlideComplete(clamped);
    },
    [viewMode, markSlideComplete]
  );

  const toggleObjective = useCallback((index: number) => {
    setCheckedObjectives((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'deck') return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentSlide, goToSlide]);

  const activeMeta = SLIDES[currentSlide - 1];

  const renderSlideContent = (slideId: number) => {
    const commonProps = {
      onGoToSlide: goToSlide,
      checkedObjectives,
      onToggleObjective: toggleObjective,
      onMarkSlideComplete: markSlideComplete,
    };

    switch (slideId) {
      case 1:
        return <Slide1Title {...commonProps} />;
      case 2:
        return <Slide2Objectives {...commonProps} />;
      case 3:
        return <Slide3WarmUp {...commonProps} />;
      case 4:
        return <Slide4WhyNotLinear {...commonProps} />;
      case 5:
        return <Slide5Sigmoid {...commonProps} />;
      case 6:
        return <Slide6OddsRatios {...commonProps} />;
      case 7:
        return <Slide7PracticeDataset onMarkSlideComplete={markSlideComplete} />;
      case 8:
        return <Slide8ManualComputation onMarkSlideComplete={markSlideComplete} />;
      case 9:
        return <Slide9FittingIRLS onMarkSlideComplete={markSlideComplete} />;
      case 10:
        return <Slide10Sklearn onMarkSlideComplete={markSlideComplete} />;
      case 11:
        return <Slide11Statsmodels onMarkSlideComplete={markSlideComplete} />;
      case 12:
        return <Slide12Evaluation onMarkSlideComplete={markSlideComplete} />;
      case 13:
        return <Slide13PitfallsRecap onMarkSlideComplete={markSlideComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => {
              setViewMode('deck');
              goToSlide(1);
            }}
            className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight whitespace-nowrap shrink-0 cursor-pointer hover:text-[#1D4ED8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            IT365 · Lesson 9
          </button>

          {/* Zone 2: Concise Module Links */}
          <nav
            aria-label="Lecture modules"
            className="hidden lg:flex items-center gap-7 text-base font-medium text-slate-600"
          >
            {SECTIONS.map((sec) => {
              const isCurrent = viewMode === 'deck' && activeMeta.section === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => goToSlide(MODULE_START_SLIDE[sec])}
                  className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-slate-950 ${
                    isCurrent
                      ? 'text-[#1D4ED8] underline decoration-2 underline-offset-8'
                      : ''
                  }`}
                >
                  {sec}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() =>
                setViewMode((m) => (m === 'deck' ? 'all' : 'deck'))
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-base font-medium hover:border-slate-500 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              {viewMode === 'deck' ? (
                <>
                  <Layers className="w-4 h-4" />
                  <span>All Slides</span>
                </>
              ) : (
                <>
                  <MonitorPlay className="w-4 h-4" />
                  <span>Deck View</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Spacious Lecture Canvas */}
      <div className="flex-1 px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        <div className="max-w-[1360px] mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
          {viewMode === 'deck' ? (
            <>
              <main className="p-6 sm:p-10 lg:p-14 min-h-[620px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {renderSlideContent(currentSlide)}
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* Clean Hairline Slide Navigation Bar */}
              <footer className="border-t border-slate-200 bg-white px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToSlide(currentSlide - 1)}
                    disabled={currentSlide === 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-base font-medium hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(currentSlide + 1)}
                    disabled={currentSlide === SLIDES.length}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-base font-medium hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div
                  className="flex items-center gap-1.5 overflow-x-auto py-1"
                  role="tablist"
                  aria-label="Slide selector"
                >
                  {SLIDES.map((s) => {
                    const isActive = s.id === currentSlide;
                    const isVisited = completedSlides.has(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Slide ${s.id}: ${s.title}`}
                        title={`${s.id}. ${s.title}`}
                        onClick={() => goToSlide(s.id)}
                        className={`w-9 h-9 rounded-lg font-mono text-sm tabular-nums transition-colors cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-[#1D4ED8] text-white font-bold'
                            : isVisited
                            ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        {s.id}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <a
                    href="./assets/IT365_Lesson_9_Logistic_Regression.pdf"
                    download="IT365_Lesson_9_Logistic_Regression.pdf"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-slate-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>PDF</span>
                  </a>
                  <div className="font-mono text-base text-slate-600 tabular-nums whitespace-nowrap shrink-0">
                    {currentSlide} / {SLIDES.length} · {activeMeta.section}
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <main className="p-6 sm:p-10 lg:p-14 space-y-16">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <span className="text-lg font-medium text-slate-600">
                  Complete Lecture Handout (13 Slides)
                </span>
                <a
                  href="./assets/IT365_Lesson_9_Logistic_Regression.pdf"
                  download="IT365_Lesson_9_Logistic_Regression.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-base font-medium hover:border-slate-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download PDF Slides</span>
                </a>
              </div>
              {SLIDES.map((slide) => (
                <section
                  key={slide.id}
                  id={`lecture-slide-${slide.id}`}
                  className="pb-14 border-b border-slate-200 last:border-b-0 last:pb-0 scroll-mt-6"
                >
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="font-mono text-base font-medium text-slate-500 tabular-nums">
                      {String(slide.id).padStart(2, '0')}. {slide.section}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('deck');
                        setCurrentSlide(slide.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-base font-medium text-[#1D4ED8] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Open in Deck View
                    </button>
                  </div>
                  {renderSlideContent(slide.id)}
                </section>
              ))}
            </main>
          )}
        </div>

        {/* Quiet Footer Disclaimer */}
        <footer className="max-w-[1360px] mx-auto pt-4 px-2 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <span>
            IT365 - Data Analytics 1 · Lesson 9: Logistic Regression
          </span>
          <span>
            Disclaimer: AI was used to generate this interactive web page; the lecture content and slides were created by Mattheus Marcus Contreras.
          </span>
        </footer>
      </div>
    </div>
  );
}
