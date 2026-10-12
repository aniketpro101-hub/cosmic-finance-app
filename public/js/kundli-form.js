/**
 * Cosmic Finance — Trading Kundli Funnel Client
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tradingKundliForm');
  const formCard = document.getElementById('kundliFormCard');
  const processingState = document.getElementById('kundliProcessingState');
  const resultCard = document.getElementById('kundliResultCard');
  const resultUserName = document.getElementById('resultUserName');
  const speculationScore = document.getElementById('speculationScore');
  const personalityArchetype = document.getElementById('personalityArchetype');
  const favoredAsset = document.getElementById('favoredAsset');
  const whatsAppLink = document.getElementById('kundliWhatsAppLink');

  const btnRequestCall = document.getElementById('btnRequestCall');
  const callDrawer = document.getElementById('callRequestDrawer');
  const callForm = document.getElementById('callRequestForm');
  const callSuccessMsg = document.getElementById('callSuccessMsg');

  let activeLeadId = null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const dob = document.getElementById('dob').value;
      const tob = document.getElementById('tob').value;
      const pob = document.getElementById('pob').value.trim();
      const approxTime = document.getElementById('approxTime').checked;
      const consent = document.getElementById('privacyConsent').checked;

      if (!fullName || !dob || !pob) {
        alert('Please fill out all required birth coordinate fields.');
        return;
      }

      if (!consent) {
        alert('Please accept the Privacy Policy consent checkbox.');
        return;
      }

      // Show processing animation
      formCard.style.display = 'none';
      processingState.style.display = 'flex';

      try {
        const response = await fetch('/api/kundli/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, dob, tob, pob, approxTime })
        });

        const data = await response.json();

        // Brief delay to allow ceremony animation to play
        setTimeout(() => {
          processingState.style.display = 'none';

          if (data.success && data.analysis) {
            activeLeadId = data.leadId;
            resultUserName.textContent = `Analysis for ${data.analysis.fullName}`;
            speculationScore.textContent = data.analysis.speculationYoga.badge;
            personalityArchetype.textContent = data.analysis.personality.title;
            favoredAsset.textContent = data.analysis.favoredAsset;

            const chartLagna = document.getElementById('chartLagnaSign');
            if (chartLagna && data.analysis.lagna) {
              chartLagna.textContent = data.analysis.lagna.sign.split(' ')[0];
            }

            // Phase 10: Populate authentic Vimshottari Mahadasha & Antardasha
            if (data.analysis.vimshottariDasha) {
              const vd = data.analysis.vimshottariDasha;
              const nakLabel = document.getElementById('birthNakshatraLabel');
              if (nakLabel) nakLabel.textContent = `Birth Nakshatra: ${vd.birthNakshatra} (${vd.birthMoonLongitude}°)`;

              if (vd.activeMahadasha) {
                const mLord = document.getElementById('mahadashaLord');
                const mDates = document.getElementById('mahadashaDates');
                const mDesc = document.getElementById('mahadashaDesc');
                if (mLord) mLord.textContent = `${vd.activeMahadasha.glyph} Lord ${vd.activeMahadasha.lord} (${vd.activeMahadasha.vedic})`;
                if (mDates) mDates.textContent = `${vd.activeMahadasha.startDate} to ${vd.activeMahadasha.endDate}`;
                if (mDesc) mDesc.textContent = vd.activeMahadasha.significance;
              }

              if (vd.activeAntardasha) {
                const aLord = document.getElementById('antardashaLord');
                const aDates = document.getElementById('antardashaDates');
                if (aLord) aLord.textContent = `Lord ${vd.activeAntardasha.lord} (${vd.activeAntardasha.vedic})`;
                if (aDates) aDates.textContent = `${vd.activeAntardasha.startDate} to ${vd.activeAntardasha.endDate}`;
              }
            }

            // Populate VedAstro Authentic Dhana & Speculation Yogas
            const dhanaBox = document.getElementById('dhanaYogasBox');
            const dhanaList = document.getElementById('dhanaYogasList');
            if (dhanaBox && dhanaList && data.analysis.vedastroAnalysis) {
              const va = data.analysis.vedastroAnalysis;
              const allYogas = [
                ...(va.dhanaYogas || []).map(y => ({ ...y, category: 'Wealth & Capital Accrual', badgeColor: 'gold' })),
                ...(va.speculationYogas || []).map(y => ({ ...y, category: 'Trading Instinct & Speculation', badgeColor: 'violet' })),
                ...(va.careerYogas || []).map(y => ({ ...y, category: 'Trade Execution & Intellect', badgeColor: 'green' })),
                ...(va.preservationYogas || []).map(y => ({ ...y, category: 'Capital Defense & Loss Control', badgeColor: 'red' }))
              ];

              function esc(str) {
                return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
              }

              if (allYogas.length > 0) {
                dhanaList.innerHTML = allYogas.slice(0, 6).map(yoga => `
                  <div class="dhana-yoga-item">
                    <div class="dhana-item-top">
                      <span class="dhana-item-name">${esc(yoga.name)}</span>
                      <span class="dhana-category-badge badge-${yoga.badgeColor}">${yoga.category}</span>
                    </div>
                    <p class="dhana-item-desc">${esc(yoga.description)}</p>
                    <div class="dhana-item-footer">
                      <span class="dhana-source-tag">📜 ${esc(yoga.classicalSource || 'Brihat Parasara Hora Sastra')}</span>
                      ${yoga.planetsInvolved && yoga.planetsInvolved.length > 0 ? `<span class="dhana-planets-tag">🪐 ${yoga.planetsInvolved.join(', ')}</span>` : ''}
                    </div>
                  </div>
                `).join('');
                dhanaBox.style.display = 'block';
              } else {
                dhanaBox.style.display = 'none';
              }
            }

            // Configure WhatsApp pre-filled message with user's name
            const msg = `Hello Cosmic Finance, I have checked my Trading Kundli (${data.analysis.fullName}, DOB: ${dob}). I would like to schedule my personal consultation report.`;
            whatsAppLink.href = `https://wa.me/918888888888?text=${encodeURIComponent(msg)}`;

            resultCard.style.display = 'block';
            resultCard.scrollIntoView({ behavior: 'smooth' });
          } else {
            formCard.style.display = 'block';
            alert(data.error || 'Unable to calculate Kundli. Please verify details.');
          }
        }, 1200);

      } catch (err) {
        processingState.style.display = 'none';
        formCard.style.display = 'block';
        alert('Connection error while calculating coordinates.');
      }
    });
  }

  // Handle Call Request
  if (btnRequestCall && callDrawer) {
    btnRequestCall.addEventListener('click', () => {
      callDrawer.style.display = callDrawer.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (callForm) {
    callForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const phone = document.getElementById('userPhone').value.trim();
      if (!phone) return;

      try {
        const res = await fetch('/api/leads/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, leadId: activeLeadId, notes: 'Call requested from Kundli result' })
        });
        const data = await res.json();
        if (data.success) {
          callForm.style.display = 'none';
          callSuccessMsg.style.display = 'block';
        }
      } catch (err) {
        alert('Failed to register call request.');
      }
    });
  }
});
