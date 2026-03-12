import type { ResumeData } from '@/types/resume';

export function generateResumeHTML(data: ResumeData, templateHtml: string, showWatermark: boolean = false): string {
  let html = templateHtml;

  // Personal info replacements
  const pi = data.personalInfo || {};
  html = html.replace(/\{\{fullName\}\}/g, pi.fullName || '');
  html = html.replace(/\{\{email\}\}/g, pi.email || '');
  html = html.replace(/\{\{phone\}\}/g, pi.phone || '');
  html = html.replace(/\{\{location\}\}/g, pi.location || '');
  html = html.replace(/\{\{linkedin\}\}/g, pi.linkedin || '');
  html = html.replace(/\{\{website\}\}/g, pi.website || '');
  html = html.replace(/\{\{summary\}\}/g, pi.summary || '');

  // Build content sections
  let content = '';

  // Summary
  if (pi.summary) {
    content += `<div class="section"><p style="font-size:14px">${pi.summary}</p></div>`;
  }

  // Experience
  if (data.experience?.length) {
    content += '<div class="section"><h2 class="section-title">Experience</h2>';
    for (const exp of data.experience) {
      const dateRange = exp.current ? `${exp.startDate} – Present` : `${exp.startDate} – ${exp.endDate || ''}`;
      content += `<div class="entry">
        <div class="entry-title">${exp.position}</div>
        <div class="entry-meta">${exp.company}${exp.location ? ' · ' + exp.location : ''} · ${dateRange}</div>
        <div class="entry-desc">${exp.description}</div>
      </div>`;
    }
    content += '</div>';
  }

  // Education
  if (data.education?.length) {
    content += '<div class="section"><h2 class="section-title">Education</h2>';
    for (const edu of data.education) {
      content += `<div class="entry">
        <div class="entry-title">${edu.degree}${edu.field ? ' in ' + edu.field : ''}</div>
        <div class="entry-meta">${edu.institution} · ${edu.endDate || edu.startDate}</div>
      </div>`;
    }
    content += '</div>';
  }

  // Skills
  if (data.skills?.length) {
    content += '<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">';
    for (const skill of data.skills) {
      content += `<span class="skill-tag">${skill}</span>`;
    }
    content += '</div></div>';
  }

  // Languages
  if (data.languages?.length) {
    content += '<div class="section"><h2 class="section-title">Languages</h2>';
    for (const lang of data.languages) {
      content += `<div class="entry"><span class="entry-title">${lang.name}</span> — ${lang.level}</div>`;
    }
    content += '</div>';
  }

  // Certifications
  if (data.certifications?.length) {
    content += '<div class="section"><h2 class="section-title">Certifications</h2>';
    for (const cert of data.certifications) {
      content += `<div class="entry"><span class="entry-title">${cert.name}</span>${cert.issuer ? ' · ' + cert.issuer : ''}${cert.date ? ' · ' + cert.date : ''}</div>`;
    }
    content += '</div>';
  }

  html = html.replace(/\{\{content\}\}/g, content);

  // Watermark for free users
  const watermark = showWatermark
    ? '<div style="position:fixed;bottom:10px;right:10px;font-size:10px;color:#ccc;font-family:sans-serif;">Created with VitaFlow</div>'
    : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}${watermark}</body></html>`;
}
