/**
 * MICHONGO - About Us View
 */
export function renderAboutView() {
  return `
    <div style="max-width: 600px; margin: 0 auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5);">
      <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin-bottom: var(--space-4);">Kuhusu MICHONGO</h2>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-3); font-size: 0.9375rem; color: var(--color-text); line-height: 1.6;">
        <p>
          MICHONGO ni mfumo wa kisasa uliotengenezwa maalum kwa ajili ya kuunganisha vijana na wadau mbalimbali ili kupata, kushiriki, na kuchapisha fursa za kazi, biashara, na miradi kwa ufanisi mkubwa.
        </p>
        <p>
          Lengo letu kuu ni kuondoa changamoto ya upatikanaji wa taarifa za fursa za kiuchumi kupitia jukwaa lililo salama, lenye muonekano safi, na linalofanya kazi kwa haraka kwenye simu na kompyuta.
        </p>
      </div>
    </div>
  `;
}

export function attachAboutEvents() {
  // Hakuna event maalum inayohitajika kwenye ukurasa huu kwa sasa
}