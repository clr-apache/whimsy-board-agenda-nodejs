// 
// Discussion Items
//

import { minutesLink } from '../agenda.js';

export default async function (agenda, { quick = false } = {}) {
  let discussion = agenda.split(/^ \d. Discussion Items\n/ms).pop().split(/^ \d. .*Action Items/ms)[0];

  let sections;

  if (!/^\s{3,5}[0-9A-Z]\./ms.test(discussion)) {
    // One (possibly empty) item for all Discussion Items
    let pattern = /^(?<attach>\s[8]\.)\s(?<title>.*?)\n(?<text>.*?)(?=\n[\s1]\d\.|\n===)/ms;

    sections = [agenda.match(pattern).groups];

    sections.forEach(attrs => {
      attrs.attach = attrs.attach.trim();
      attrs.prior_reports = minutesLink(attrs.title);
    })
  } else {
    // Separate items for each individual Discussion Item
    let pattern = /\n+(?<indent>\s{3,5})(?<section>[0-9A-Z])\.\s(?<title>[^]*?)\n(?<text>[^]*?)(?=\n\s{3,5}[0-9A-Z]\.\s|$)/sg;

    sections = [...discussion.matchAll(pattern)].map(match => match.groups);

    sections.forEach(attrs => {
      attrs.section = "8" + attrs.section
    });
  }

  return sections;
}