import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How does Siam Downloader remove TikTok watermarks?',
      answer: 'Our engine extracts the original source video stream directly from the content distribution server before TikTok adds the floating bouncing watermark and end screen logo. You get the 100% untouched raw video.',
    },
    {
      question: 'Can I download Instagram Reels and Carousels?',
      answer: 'Yes! Siam Downloader fully supports public Instagram Reels, IGTV videos, and feed clips. Just copy the link from the Instagram app or browser and paste it here to download in 1080p Full HD with original synchronized sound.',
    },
    {
      question: 'Where are downloaded videos saved on iPhone or Android?',
      answer: 'On Android, videos are saved directly to your Downloads folder and automatically appear in your Gallery/Photos app. On iPhone/iPad (iOS 13+), Safari saves the file to your Downloads folder inside the Files app, from which you can easily tap "Save Video" to send it to your Camera Roll.',
    },
    {
      question: 'Is Siam Downloader free, and is there any daily download limit?',
      answer: 'Siam Downloader is 100% free with unlimited downloads. There are no subscriptions, hidden fees, account sign-ups, or annoying cap limits on how many clips you can save.',
    },
    {
      question: 'Can I convert YouTube videos to MP3 audio only?',
      answer: 'Absolutely. When you paste any YouTube video URL, switch to the "Audio Only (MP3)" tab on the result card and click "Download MP3". You will receive high-quality 320kbps stereo audio without needing separate conversion tools.',
    },
    {
      question: 'Do you store downloaded videos or track my search queries?',
      answer: 'No. Siam Downloader operates as an on-the-fly streaming gateway. We do not store, host, or catalog any downloaded videos on our servers, nor do we log your personal IP address or history.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          Everything you need to know about downloading videos without watermarks.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'glass-panel-glow border-emerald-500/40 bg-slate-900/90' 
                  : 'glass-panel border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-emerald-300' : 'text-slate-400'
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
