
document.addEventListener('DOMContentLoaded', () => {
  const categories = [
    { id: 'MAKANAN', text: 'Makanan', color: 'blue' },
    { id: 'MINUMAN', text: 'Minuman', color: 'teal' },
    { id: 'SNACK', text: 'Snack', color: 'purple' }
  ];

  const allProducts = [
    { id: 1, nama: 'Nasi Goreng', kategori: 'MAKANAN', terjual: 33, omzet: 396000 },
    { id: 2, nama: 'Mie Ayam', kategori: 'MAKANAN', terjual: 35, omzet: 350000 },
    { id: 3, nama: 'Nasi Kuning', kategori: 'MAKANAN', terjual: 23, omzet: 253000 },
    { id: 4, nama: 'Es Teh Manis', kategori: 'MINUMAN', terjual: 42, omzet: 126000 },
    { id: 5, nama: 'Jati Jeruk', kategori: 'MINUMAN', terjual: 17, omzet: 68000 },
    { id: 6, nama: 'Keripik Singkong', kategori: 'SNACK', terjual: 18, omzet: 90000 },
    { id: 7, nama: 'Air Mineral', kategori: 'MINUMAN', terjual: 18, omzet: 72000 },
    { id: 8, nama: 'Susu Kotak', kategori: 'MINUMAN', terjual: 12, omzet: 72000 }
  ];

  const promos = [
    { id: 1, emoji: '🍱', judul: 'Genot Hemat', sub: 'Cek Ayam cuma Rp15000', lozText: 'Diskon', lozColor: 'yellow' },
    { id: 2, emoji: '🍲', judul: 'Paket Sarapan', sub: 'Pagi ceria soto ayam Rp12000', lozText: 'Setiap hari', lozColor: 'green' },
    { id: 3, emoji: '☕', judul: 'Menu Barista', sub: 'Pisang goreng boba', lozText: 'Diskon', lozColor: 'yellow' },
    { id: 4, emoji: '⭐', judul: 'Jum’at Berkah', sub: 'Air mineral gratis tiap beli makanan', lozText: 'Jum’at', lozColor: 'red' }
  ];

  // Tema Gelap/Terang
  const btnTheme = document.getElementById('btnTheme');
  const htmlEl = document.documentElement;

  function updateThemeButton(mode) {
    if (btnTheme) {
      const span = btnTheme.querySelector('span');
      if (span) span.textContent = mode === 'dark' ? 'Mode terang' : 'Mode gelap';
    }
  }

  updateThemeButton(htmlEl.getAttribute('data-color-mode') || 'light');

  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      let currentMode = htmlEl.getAttribute('data-color-mode');
      let newMode = currentMode === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-color-mode', newMode);
      try { localStorage.setItem('kantin-color-mode', newMode); } catch(e){}
      updateThemeButton(newMode);
      updateChartsTheme(newMode);
    });
  }

  // Tom Select Kategori
  const selectKat = document.getElementById('fKat');
  if (selectKat) {
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.text;
      selectKat.appendChild(opt);
    });
  }

  let tomSelectInstance = new TomSelect('#fKat', {
    plugins: ['remove_button'],
    placeholder: 'Pilih kategori...',
    persist: false,
    create: false,
    onChange: () => { updateDashboardData(); }
  });

  // Flatpickr Tanggal
  const fDateInput = document.getElementById('fDate');
  let fp = flatpickr(fDateInput, {
    mode: 'range',
    dateFormat: 'Y-m-d',
    locale: 'id',
    defaultDate: ['2026-10-17', '2026-10-23'],
    altInput: true,
    altFormat: 'j M Y',
    onChange: function(selectedDates) {
      if (selectedDates.length === 2) { updateDashboardData(); }
    }
  });

  const dRangeEl = document.getElementById('dRange');
  function updateDateRangeLabel(dates) {
    if (!dRangeEl) return;
    if (dates && dates.length === 2) {
      const opt = { day: 'numeric', month: 'short', year: 'numeric' };
      const d1 = dates[0].toLocaleDateString('id-ID', opt);
      const d2 = dates[1].toLocaleDateString('id-ID', opt);
      dRangeEl.textContent = `${d1} - ${d2}`;
    } else {
      dRangeEl.textContent = '-';
    }
  }

  // Chart.js Inisialisasi
  const ctxBar = document.getElementById('cBar')?.getContext('2d');
  const ctxDn = document.getElementById('cDn')?.getContext('2d');
  let barChart, donutChart;

  function getCssVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }

  function initCharts() {
    const textColor = getCssVariable('--ds-text') || '#292A2E';
    const gridColor = getCssVariable('--ds-border') || '#0B120E24';
    const chartBrand = getCssVariable('--ds-chart-brand') || '#357DE8';

    if (ctxBar) {
      barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Sen, 17', 'Sel, 18', 'Rab, 19', 'Kam, 20', 'Jum, 21', 'Sab, 22', 'Min, 23'],
          datasets: [{
            label: 'Omzet',
            data: [180000, 150000, 120000, 190000, 210000, 240000, 320000],
            backgroundColor: chartBrand,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }

    if (ctxDn) {
      donutChart = new Chart(ctxDn, {
        type: 'doughnut',
        data: {
          labels: ['Makanan', 'Minuman', 'Snack'],
          datasets: [{
            data: [120, 95, 46],
            backgroundColor: ['#357DE8', '#94C748', '#C97CF4'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } }
          }
        }
      });
    }
  }

  initCharts();

  function updateChartsTheme(mode) {
    const textColor = getCssVariable('--ds-text');
    const gridColor = getCssVariable('--ds-border');
    if (barChart) {
      barChart.options.scales.x.ticks.color = textColor;
      barChart.options.scales.y.ticks.color = textColor;
      barChart.options.scales.y.grid.color = gridColor;
      barChart.update();
    }
    if (donutChart) {
      donutChart.options.plugins.legend.labels.color = textColor;
      donutChart.update();
    }
  }

  // Tabulator Tabel Produk (Dinamis Berdasarkan Filter)
  let table = new Tabulator("#tProd", {
    data: allProducts,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 5,
    columns: [
      { title: "Produk", field: "nama", widthGrow: 2, headerFilter: "input", headerFilterPlaceholder: "Cari produk..." },
      { 
        title: "Kategori", 
        field: "kategori", 
        widthGrow: 1.2,
        formatter: function(cell) {
          const val = cell.getValue();
          let colorClass = 'blue';
          if (val === 'MINUMAN') colorClass = 'teal';
          if (val === 'SNACK') colorClass = 'purple';
          return `<span class="lozenge ${colorClass}">${val}</span>`;
        }
      },
      { title: "Terjual", field: "terjual", hozAlign: "center", widthGrow: 0.8, cssClass: "num" },
      { 
        title: "Omzet", 
        field: "omzet", 
        hozAlign: "right", 
        widthGrow: 1.2, 
        cssClass: "num",
        formatter: function(cell) { return 'Rp ' + cell.getValue().toLocaleString('id-ID'); }
      },
      {
        formatter: function() {
          return `<button class="icon-btn del" type="button" aria-label="Hapus"><svg class="ic" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`;
        },
        width: 50,
        hozAlign: "center",
        cellClick: function(e, cell) {
          const rowData = cell.getRow().getData();
          Swal.fire({
            title: `<svg class="ic" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg> Hapus ${rowData.nama}?`,
            html: "Produk dan transaksinya akan hilang dari laporan.<br>Tindakan ini tidak bisa dibatalkan.",
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            customClass: { popup: 'ads-modal', confirmButton: 'btn danger', cancelButton: 'btn subtle' },
            buttonsStyling: false
          }).then((result) => {
            if (result.isConfirmed) {
              const idx = allProducts.findIndex(p => p.id === rowData.id);
              if(idx > -1) allProducts.splice(idx, 1);
              updateDashboardData();
            }
          });
        }
      }
    ],
  });

  // Render Promo
  const promoEl = document.getElementById('promo');
  const pCount = document.getElementById('pCount');
  if (promoEl) {
    promoEl.innerHTML = '';
    promos.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="p-emoji" style="background:var(--ds-background-neutral)">${p.emoji}</div>
        <div class="p-body"><b>${p.judul}</b><small>${p.sub}</small></div>
        <span class="lozenge ${p.lozColor}">${p.lozText}</span>
      `;
      promoEl.appendChild(li);
    });
    if (pCount) pCount.textContent = `${promos.length} aktif`;
  }

  // Floating UI Tooltip
  const tooltip = document.getElementById('tooltip');
  function showTooltip(button, text) {
    if (!tooltip) return;
    tooltip.textContent = text;
    tooltip.style.opacity = '1';
    if (window.FloatingUI && window.FloatingUI.computePosition) {
      window.FloatingUI.computePosition(button, tooltip, {
        placement: 'top',
        middleware: [window.FloatingUI.offset(6), window.FloatingUI.shift(), window.FloatingUI.flip()]
      }).then(({x, y}) => {
        Object.assign(tooltip.style, { left: `${x}px`, top: `${y}px` });
      });
    }
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.style.opacity = '0';
  }

  document.querySelectorAll('button[data-tip]').forEach(btn => {
    const tipText = btn.getAttribute('data-tip');
    btn.addEventListener('mouseenter', () => showTooltip(btn, tipText));
    btn.addEventListener('mouseleave', hideTooltip);
    btn.addEventListener('focus', () => showTooltip(btn, tipText));
    btn.addEventListener('blur', hideTooltip);
  });

  // FUNGSI UTAMA REAKTIF (BERUBAH SAAT TANGGAL ATAU KATEGORI DIGANTI)
  function updateDashboardData() {
    const selectedCats = tomSelectInstance.getValue(); // Array kategori terpilih
    const dates = fp.selectedDates;
    updateDateRangeLabel(dates);

    // Filter produk berdasarkan kategori yang dipilih di Tom Select
    let filteredProducts = allProducts;
    if (selectedCats && selectedCats.length > 0) {
      filteredProducts = allProducts.filter(p => selectedCats.includes(p.kategori));
    }

    // Perbarui data tabel Tabulator secara otomatis
    table.setData(filteredProducts);

    // Hitung ulang total nilai KPI berdasarkan hasil filter produk & tanggal
    let totalOmzet = filteredProducts.reduce((sum, p) => sum + p.omzet, 0);
    let totalTerjual = filteredProducts.reduce((sum, p) => sum + p.terjual, 0);
    let totalTrx = filteredProducts.length * 2; // Simulasi transaksi

    // Simulasi penyesuaian angka persis seperti skenario video saat rentang tanggal diubah ke awal bulan (tanggal 1)
    if (dates.length === 2 && dates[0].getDate() === 1) {
      totalOmzet = Math.round(totalOmzet * 0.82);
      totalTerjual = Math.round(totalTerjual * 0.85);
      totalTrx = Math.max(5, totalTrx - 3);
    }

    // Jika tidak ada produk tersaring, beri nilai minimum agar tidak kosong melompong
    if (filteredProducts.length === 0) {
      totalOmzet = 0;
      totalTerjual = 0;
      totalTrx = 0;
    }

    // Render ke elemen HTML
    document.getElementById('kOmzet').textContent = 'Rp ' + totalOmzet.toLocaleString('id-ID');
    document.getElementById('kItem').textContent = totalTerjual;
    document.getElementById('kTrx').textContent = totalTrx;
    document.getElementById('cOmzet').textContent = totalTerjual > 0 ? `Rata-rata Rp ${Math.round(totalOmzet / totalTerjual).toLocaleString('id-ID')} per porsi` : 'Tidak ada data';
    document.getElementById('tCount').textContent = `${filteredProducts.length} produk`;

    // Perbarui Grafik Donat & Batang secara dinamis
    if (donutChart) {
      let mCount = filteredProducts.filter(p => p.kategori === 'MAKANAN').reduce((s,p)=>s+p.terjual, 0);
      let dCount = filteredProducts.filter(p => p.kategori === 'MINUMAN').reduce((s,p)=>s+p.terjual, 0);
      let sCount = filteredProducts.filter(p => p.kategori === 'SNACK').reduce((s,p)=>s+p.terjual, 0);
      
      if(selectedCats.length > 0) {
        if(!selectedCats.includes('MAKANAN')) mCount = 0;
        if(!selectedCats.includes('MINUMAN')) dCount = 0;
        if(!selectedCats.includes('SNACK')) sCount = 0;
      }

      donutChart.data.datasets[0].data = [mCount || 10, dCount || 10, sCount || 10];
      donutChart.update();
    }

    if (barChart) {
      let multiplier = totalOmzet > 1000000 ? 1 : 0.4;
      barChart.data.datasets[0].data = [
        Math.round(180000 * multiplier),
        Math.round(150000 * multiplier),
        Math.round(120000 * multiplier),
        Math.round(190000 * multiplier),
        Math.round(210000 * multiplier),
        Math.round(240000 * multiplier),
        Math.round(totalOmzet - 1090000 * multiplier > 0 ? totalOmzet - 1090000 * multiplier : 150000)
      ];
      barChart.update();
    }
  }

  // Panggil pertama kali saat halaman dimuat
  updateDashboardData();
});
