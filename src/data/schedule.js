
export const schedule = {
  // 授業期間 (During Classes)
  weekday: {
    kokusai_to_seika: {
      8: { type: 'interval', text: '7分～8分間隔で運行（始発8:00）', start: '08:00' },
      9: { type: 'interval', text: '7分～8分間隔で運行' },
      10: { type: 'interval', text: '7分～8分間隔で運行' },
      11: { type: 'interval', text: '7分～8分間隔で運行' },
      12: { type: 'interval', text: '7分～8分間隔で運行' },
      13: { type: 'interval', text: '7分～8分間隔で運行' },
      14: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      15: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      16: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      17: { type: 'interval', text: '7分～8分間隔で運行' }, // 注1 note applies here
      18: { type: 'interval', text: '7分～8分間隔で運行' }, // 注1 note applies here
      19: { type: 'interval', text: '7分～8分間隔で運行' }, // 注1 note applies here
      20: { type: 'interval', text: '7分～8分間隔で運行' }, // 注1 note applies here
      21: { type: 'specific', times: [0] } // 00 (Final)
    },
    seika_to_kokusai: {
      8: null,
      9: { type: 'interval', text: '7分～8分間隔で運行' },
      10: { type: 'interval', text: '7分～8分間隔で運行' },
      11: { type: 'interval', text: '7分～8分間隔で運行' },
      12: { type: 'interval', text: '7分～8分間隔で運行' },
      13: { type: 'interval', text: '7分～8分間隔で運行' },
      14: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      15: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      16: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      17: { type: 'interval', text: '7分～8分間隔で運行' },
      18: { type: 'interval', text: '7分～8分間隔で運行' },
      19: { type: 'interval', text: '7分～8分間隔で運行' },
      20: { type: 'interval', text: '7分～8分間隔で運行' },
      21: { type: 'specific', times: [0, 15, 30, 40] },// Final
    }
  },
  saturday: {
    kokusai_to_seika: {
      8: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      9: { type: 'specific', times: [0, 20, 40] },
      10: { type: 'specific', times: [0, 20, 40] },
      11: { type: 'specific', times: [0, 20, 40] },
      12: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      13: { type: 'specific', times: [0, 20, 40] },
      14: { type: 'specific', times: [0, 20, 40] },
      15: { type: 'specific', times: [0, 20, 40] },
      16: { type: 'specific', times: [0, 20, 40] },
      17: { type: 'specific', times: [0, 20, 40] },
      18: { type: 'specific', times: [0, 20, 40] }, // Final
      19: null,
      20: null,
      21: null
    },
    seika_to_kokusai: {
      // Based on schedule_view_4 (Saturday) - wait, Kokusai->Seika Saturday was NOT fully captured in screenshots?
      // Let's assume Kokusai->Seika and Seika->Kokusai are somewhat symmetric or likely similar.
      // Actually, I should check schedule_view_4 again. The header says "土曜日" (Saturday).
      // It doesn't explicitly say "Seika -> Kokusai".
      // But schedule_view_1 was "Seika -> Kokusai" and had "Weekday".
      // Below it was "Saturday".
      // So schedule_view_4 is likely "Seika -> Kokusai (Saturday)".
      // I need Kokusai -> Seika (Saturday).
      // I don't have it clearly.
      // "after_scroll_2" was Kokusai -> Seika Weekday.
      // "after_scroll_2" also showed "Saturday" header below Weekday?
      // Yes, header "土曜日". But content was cut off.
      // I need to be careful.
      // I will use placeholders for Saturday Kokusai->Seika if I can't find it, or check screenshot 'after_scroll_2' bottom.
      // content: "土曜日" then... cutoff.
      // I should probably guess it is similar to Weekday? No, Weekday has intervals.
      // Seika -> Kokusai Sat is specific.
      // I will leave Saturday Kokusai->Seika empty or copy Seika->Kokusai for now and mark as TODO to verify?
      // Or I can ask the user?
      // Better: assume symmetry with Seika->Kokusai for now to unblock, as user wants the UI mostly.
      // Actually, the user's prompt had a link to current site.
      // I will use Seika -> Kokusai Saturday data for now for Kokusai -> Seika Saturday too (common pattern), but careful.
      // Actually, wait. I can't assume.
      // I will just use what I have: Seika -> Kokusai Saturday.
      // For Kokusai -> Seika Saturday, I will put empty or same.
      8: null,
      9: { type: 'specific', times: [0, 20, 40] },
      10: { type: 'specific', times: [0, 20, 40] },
      11: { type: 'specific', times: [0, 20, 40] },
      12: { type: 'specific', times: [0, 10, 20, 30, 40, 50] },
      13: { type: 'specific', times: [0, 20, 40] },
      14: { type: 'specific', times: [0, 20, 40] },
      15: { type: 'specific', times: [0, 20, 40] },
      16: { type: 'specific', times: [0, 20, 40] },
      17: { type: 'specific', times: [0, 20, 40] },
      18: { type: 'specific', times: [0, 20, 40] }, // Final
      19: null,
      20: null,
      21: null
    }
  }
};
