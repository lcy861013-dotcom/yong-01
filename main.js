// State
  const measurements = {};
  const radioSelections = {};
  let filledCount = 0;
  const totalParts = 9;

  const partNames = {
    head: '머리/모자',
    shoulder: '어깨 너비',
    chest: '가슴/상체',
    arm: '팔 길이',
    waist: '허리',
    hip: '골반',
    thigh: '복숭아뼈→무릎',
    knee: '무릎→골반',
    foot: '발 사이즈'
  };

  const panelTitles = {
    head: 'HEAD / 머리',
    shoulder: 'SHOULDER / 어깨',
    chest: 'CHEST / 상체',
    arm: 'ARM / 팔',
    waist: 'WAIST / 허리',
    hip: 'HIP / 골반',
    thigh: 'THIGH / 하체',
    knee: 'KNEE / 무릎~골반',
    foot: 'FOOT / 발'
  };

  function selectPart(part) {
    // Hide all forms
    document.querySelectorAll('.measurement-form').forEach(f => f.classList.remove('visible'));
    document.getElementById('placeholder').style.display = 'none';

    // Show selected form
    document.getElementById('form-' + part).classList.add('visible');

    // Update hotspot styles
    document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('active'));
    document.getElementById('hs-' + part).classList.add('active');

    // Update panel title
    document.getElementById('panel-title').textContent = panelTitles[part];
  }

  function selectRadio(group, value) {
    radioSelections[group] = value;
    const container = document.getElementById('radio-' + group);
    if (container) {
      container.querySelectorAll('.radio-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.textContent === value);
      });
    }
  }

  function savePart(part) {
    const data = {};
    let hasData = false;

    if (part === 'head') {
      data.hat = radioSelections['hat'] || null;
      data.circ = document.getElementById('head-circ').value;
      hasData = data.hat || data.circ;
    } else if (part === 'shoulder') {
      data.width = document.getElementById('shoulder-width').value;
      hasData = data.width;
    } else if (part === 'chest') {
      data.circ = document.getElementById('chest-circ').value;
      data.size = radioSelections['top'] || null;
      hasData = data.circ || data.size;
    } else if (part === 'arm') {
      data.lower = document.getElementById('arm-lower').value;
      data.upper = document.getElementById('arm-upper').value;
      hasData = data.lower || data.upper;
    } else if (part === 'waist') {
      data.circ = document.getElementById('waist-circ').value;
      hasData = data.circ;
    } else if (part === 'hip') {
      data.circ = document.getElementById('hip-circ').value;
      hasData = data.circ;
    } else if (part === 'thigh') {
      data.len = document.getElementById('thigh-len').value;
      data.circ = document.getElementById('thigh-circ').value;
      hasData = data.len || data.circ;
    } else if (part === 'knee') {
      data.len = document.getElementById('knee-len').value;
      hasData = data.len;
    } else if (part === 'foot') {
      data.size = document.getElementById('foot-size').value;
      data.width = radioSelections['foot-width'] || null;
      hasData = data.size || data.width;
    }

    if (!hasData) {
      showToast('값을 입력해주세요!');
      return;
    }

    const isNew = !measurements[part];
    measurements[part] = data;

    if (isNew) {
      filledCount++;
      document.getElementById('hs-' + part).classList.add('filled');
    }

    updateProgress();
    updateSavedList();
    showToast(partNames[part] + ' 저장 완료! ✓');
  }

  function updateProgress() {
    const pct = (filledCount / totalParts) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = filledCount + ' / ' + totalParts;
  }

  function updateSavedList() {
    const list = document.getElementById('saved-list');
    const items = document.getElementById('saved-items');
    list.style.display = 'block';

    let html = '';
    for (const [part, data] of Object.entries(measurements)) {
      let valueStr = '';
      if (part === 'head') valueStr = (data.hat ? data.hat : '') + (data.circ ? ' / ' + data.circ + 'cm' : '');
      else if (part === 'shoulder') valueStr = data.width + 'cm';
      else if (part === 'chest') valueStr = (data.circ ? data.circ + 'cm' : '') + (data.size ? ' / ' + data.size : '');
      else if (part === 'arm') valueStr = (data.lower || '?') + 'cm + ' + (data.upper || '?') + 'cm';
      else if (part === 'waist') valueStr = data.circ + 'cm';
      else if (part === 'hip') valueStr = data.circ + 'cm';
      else if (part === 'thigh') valueStr = (data.len || '?') + 'cm / ' + (data.circ || '?') + 'cm';
      else if (part === 'knee') valueStr = data.len + 'cm';
      else if (part === 'foot') valueStr = (data.size ? data.size + 'mm' : '') + (data.width ? ' / 발볼 ' + data.width : '');

      html += `<div class="saved-item">
        <span class="saved-item-label">${partNames[part].toUpperCase()}</span>
        <span class="saved-item-value">${valueStr}</span>
      </div>`;
    }
    items.innerHTML = html;
  }

  function getRecommendation() {
    if (filledCount === 0) {
      showToast('먼저 신체 정보를 입력해주세요!');
      return;
    }
    showToast('🔥 ' + filledCount + '개 기준으로 핏 분석 중...');
    setTimeout(() => showToast('✓ 준비 완료! (서비스 연동 예정)'), 2000);
  }

  function resetAll() {
    if (!confirm('모든 측정값을 초기화할까요?')) return;
    Object.keys(measurements).forEach(k => delete measurements[k]);
    filledCount = 0;
    document.querySelectorAll('.hotspot').forEach(h => { h.classList.remove('filled', 'active'); });
    document.querySelectorAll('.measurement-form').forEach(f => f.classList.remove('visible'));
    document.getElementById('placeholder').style.display = 'flex';
    document.getElementById('saved-list').style.display = 'none';
    document.getElementById('saved-items').innerHTML = '';
    updateProgress();
    showToast('초기화 완료');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }