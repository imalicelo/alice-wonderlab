import pdfBytes from './wanyi-wei-resume.pdf';

// One object URL per document. The browser releases it when the page is unloaded.
// Keeping it alive also makes downloads work when returning via the back cache.
let resumeUrl;
export function getResumeUrl() {
  return resumeUrl ||= URL.createObjectURL(new Blob([pdfBytes], {type:'application/pdf'}));
}
