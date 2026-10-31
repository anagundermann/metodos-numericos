(() => {
  if (!window.matchMedia('(max-width: 650px)').matches) return;

  const ajustados = new WeakSet();

  function ajustarGraficos() {
    if (!window.Plotly || !window.Plotly.relayout) return;

    document.querySelectorAll('.simulacion-grafico .js-plotly-plot').forEach(grafico => {
      if (ajustados.has(grafico) || !grafico._fullLayout) return;

      const sliders = grafico.layout.sliders || [];
      const tieneSlider = sliders.length > 0;
      const tieneBotones = (grafico.layout.updatemenus || []).length > 0;
      const tieneLeyenda = grafico._fullLayout.showlegend;

      if (!tieneSlider && !tieneLeyenda) return;
      ajustados.add(grafico);

      const cambios = {
        'dragmode': false,
        'hovermode': false,
        'height': tieneSlider ? 545 : 450,
        'margin.l': 55,
        'margin.r': 12,
        'margin.t': tieneLeyenda ? 105 : 35,
        'margin.b': tieneSlider ? 185 : 75
      };

      if (tieneLeyenda) {
        cambios['legend.orientation'] = 'h';
        cambios['legend.x'] = 0.5;
        cambios['legend.xanchor'] = 'center';
        cambios['legend.y'] = 1.1;
        cambios['legend.yanchor'] = 'bottom';
        cambios['legend.font.size'] = 10;
      }

      if (tieneSlider) {
        cambios['sliders[0].x'] = 0.07;
        cambios['sliders[0].len'] = 0.89;
        cambios['sliders[0].y'] = -0.43;
        cambios['sliders[0].pad.t'] = 0;
        cambios['sliders[0].currentvalue.font.size'] = 11;
        cambios['sliders[0].font.size'] = 9;
        const pasos = sliders[0].steps || [];
        const intervalo = Math.max(1, Math.ceil((pasos.length - 1) / 4));
        cambios['sliders[0].steps'] = pasos.map((paso, i) => ({
          ...paso,
          label: (i % intervalo === 0 || i === pasos.length - 1) ? paso.label : ' '
        }));
      }

      if (tieneBotones && tieneSlider) {
        cambios['height'] = 620;
        cambios['margin.b'] = 230;
        cambios['updatemenus[0].x'] = 0.07;
        cambios['updatemenus[0].y'] = -0.32;
        cambios['updatemenus[0].xanchor'] = 'left';
        cambios['sliders[0].y'] = -0.62;
      }

      window.Plotly.relayout(grafico, cambios).catch(() => ajustados.delete(grafico));
    });
  }

  let intentos = 0;
  const id = setInterval(() => {
    ajustarGraficos();
    if (++intentos >= 40) clearInterval(id);
  }, 600);
  window.addEventListener('load', ajustarGraficos, { once: true });
})();
