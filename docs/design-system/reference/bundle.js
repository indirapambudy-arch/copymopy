/* @ds-bundle: {"format":4,"namespace":"Copymopy","components":[{"name":"Button"},{"name":"IconButton"},{"name":"TextField"},{"name":"TextArea"},{"name":"Chip"},{"name":"ChipGroup"},{"name":"ResultCard"},{"name":"ResultSkeleton"},{"name":"Toast"},{"name":"EmptyState"},{"name":"Icon"},{"name":"Logo"},{"name":"Dropdown"},{"name":"Uploader"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState, useRef = React.useRef, useEffect = React.useEffect, useId = React.useId;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  /* Icons: 24px grid, 2px stroke, round caps. */
  var PATHS = {
    copy: [['rect', { x: 9, y: 9, width: 12, height: 12, rx: 2 }], ['path', { d: 'M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1' }]],
    check: [['path', { d: 'M20 6 9 17l-5-5' }]],
    refresh: [['path', { d: 'M20 12a8 8 0 1 1-2.4-5.7L20 8.6' }], ['path', { d: 'M20 3.5v5.1h-5.1' }]],
    loader: [['path', { d: 'M21 12a9 9 0 1 1-6.2-8.6' }]],
    close: [['path', { d: 'M6 6l12 12M18 6 6 18' }]],
    'chevron-down': [['path', { d: 'M6 9l6 6 6-6' }]],
    upload: [['path', { d: 'M12 15V4' }], ['path', { d: 'M7 9l5-5 5 5' }], ['path', { d: 'M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3' }]],
    pencil: [['path', { d: 'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z' }], ['path', { d: 'M13.5 6.5l4 4' }]],
    file: [['path', { d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' }], ['path', { d: 'M14 3v5h5' }]],
    sparkles: [['path', { d: 'M10 5Q11 11 17 12Q11 13 10 19Q9 13 3 12Q9 11 10 5Z' }], ['path', { d: 'M18 2Q18.5 4.5 21 5Q18.5 5.5 18 8Q17.5 5.5 15 5Q17.5 4.5 18 2Z' }], ['path', { d: 'M19 15.5Q19.4 17.6 21.5 18Q19.4 18.4 19 20.5Q18.6 18.4 16.5 18Q18.6 17.6 19 15.5Z' }]],
    sparkle: [['path', { d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z' }], ['path', { d: 'M19 16v4M17 18h4' }]],
    alert: [['circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', stroke: 'none' }], ['path', { d: 'M12 7v6', stroke: '#ffffff' }], ['path', { d: 'M12 16.5v.5', stroke: '#ffffff' }]]
  };

  function Icon(props) {
    var parts = PATHS[props.name] || [];
    return h('svg', {
      className: cx('cm-icon', props.className), viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false'
    }, parts.map(function (p, i) { return h(p[0], Object.assign({ key: i }, p[1])); }));
  }

  function Button(props) {
    var variant = props.variant || 'primary', size = props.size || 'md';
    var rest = Object.assign({}, props);
    ['variant', 'size', 'loading', 'icon', 'children', 'className'].forEach(function (k) { delete rest[k]; });
    var label = props.children;
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('cm-btn', 'cm-btn-' + variant, 'cm-btn-' + size, props.className),
      'aria-busy': props.loading ? 'true' : undefined,
      disabled: props.disabled
    }),
      props.loading
        ? h(React.Fragment, null, h(Icon, { name: 'loader', className: 'cm-spin' }), h('span', { className: 'cm-sr', style: srOnly }, typeof label === 'string' ? label : 'Loading'))
        : h(React.Fragment, null, props.icon ? h(Icon, { name: props.icon }) : null, label)
    );
  }
  var srOnly = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };

  function IconButton(props) {
    var rest = Object.assign({}, props);
    ['icon', 'label', 'size', 'className'].forEach(function (k) { delete rest[k]; });
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('cm-iconbtn', props.size === 'sm' && 'cm-iconbtn-sm', props.className),
      'aria-label': props.label, title: props.label
    }), h(Icon, { name: props.icon }));
  }

  function Field(props, control) {
    var id = props.id;
    var hasErr = !!props.error;
    var count = props.maxLength ? String((props.value || '').length) + ' / ' + props.maxLength : null;
    var msg = hasErr ? props.error : props.helper;
    return h('div', { className: cx('cm-field', hasErr && 'cm-field-error', props.disabled && 'cm-field-disabled', props.className) },
      h('label', { className: 'cm-label', htmlFor: id }, props.label),
      control,
      (msg || count) ? h('div', { className: 'cm-meta' },
        msg ? h('span', { className: 'cm-meta-msg', id: id + '-msg' }, hasErr ? h(Icon, { name: 'alert' }) : null, msg) : null,
        count ? h('span', { className: 'cm-meta-count', 'aria-live': 'polite' }, count) : null
      ) : null
    );
  }

  function useControlled(props) {
    var s = useState(props.defaultValue || '');
    var controlled = props.value !== undefined;
    return [controlled ? props.value : s[0], function (e) { if (!controlled) s[1](e.target.value); if (props.onChange) props.onChange(e); }];
  }

  function makeField(tag) {
    return function (props) {
      var auto = useId();
      var id = props.id || 'cm' + auto.replace(/:/g, '');
      var v = useControlled(props);
      var control = h(tag, {
        id: id, className: 'cm-input', value: v[0], onChange: v[1], placeholder: props.placeholder,
        disabled: props.disabled, maxLength: props.maxLength, rows: tag === 'textarea' ? (props.rows || 4) : undefined,
        'aria-invalid': props.error ? 'true' : undefined,
        'aria-describedby': (props.error || props.helper) ? id + '-msg' : undefined,
        autoFocus: props.autoFocus
      });
      return Field(Object.assign({}, props, { id: id, value: v[0] }), control);
    };
  }
  var TextField = makeField('input');
  var TextArea = makeField('textarea');

  /* Dropdown: a native <select> drawn like TextField (same label, border, focus, error and disabled states)
     with a chevron. The open list is the browser's own, so keyboard and screen readers work everywhere. */
  function Dropdown(props) {
    var auto = useId();
    var id = props.id || 'cm' + auto.replace(/:/g, '');
    var s = useState(props.defaultValue || '');
    var controlled = props.value !== undefined;
    var value = controlled ? props.value : s[0];
    var onChange = function (e) { if (!controlled) s[1](e.target.value); if (props.onChange) props.onChange(e); };
    var options = props.options || [];
    var select = h('div', { className: 'cm-select' },
      h('select', {
        id: id, className: cx('cm-input', value === '' && 'cm-select-empty'), value: value, onChange: onChange,
        disabled: props.disabled, 'aria-invalid': props.error ? 'true' : undefined,
        'aria-describedby': (props.error || props.helper) ? id + '-msg' : undefined
      },
        props.placeholder !== undefined ? h('option', { value: '', disabled: true }, props.placeholder) : null,
        options.map(function (o) { return h('option', { key: o.value, value: o.value, disabled: o.disabled }, o.label); })
      ),
      h(Icon, { name: 'chevron-down', className: 'cm-select-chevron' })
    );
    return Field(Object.assign({}, props, { id: id, value: value, maxLength: undefined }), select);
  }

  /* Uploader: a labelled drop zone over a real file input. Click, Enter/Space or drag a file in.
     Checks type (accept) and size (maxSize, bytes) before handing the file to onFile(file, dataUrl). */
  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB';
    return (Math.round(n / 1024 / 1024 * 10) / 10) + ' MB';
  }
  function acceptsType(file, accept) {
    if (!accept) return true;
    var name = (file.name || '').toLowerCase(), type = (file.type || '').toLowerCase();
    return accept.split(',').some(function (a) {
      a = a.trim().toLowerCase();
      if (!a) return false;
      if (a.charAt(0) === '.') return name.slice(-a.length) === a;
      if (a.slice(-2) === '/*') return type.indexOf(a.slice(0, -1)) === 0;
      return type === a;
    });
  }
  function Uploader(props) {
    var auto = useId();
    var id = props.id || 'cm' + auto.replace(/:/g, '');
    var ds = useState(false), dragging = ds[0], setDragging = ds[1];
    var fs = useState(null), local = fs[0], setLocal = fs[1];
    var es = useState(''), localErr = es[0], setLocalErr = es[1];
    var inputRef = useRef(null);
    var file = props.value !== undefined ? props.value : local;
    var error = props.error || localErr;
    function take(f) {
      if (!f) return;
      if (!acceptsType(f, props.accept)) { setLocalErr(props.typeError || 'This file type isn’t supported. ' + (props.hint || '')); return; }
      if (props.maxSize && f.size > props.maxSize) { setLocalErr('This file is ' + formatBytes(f.size) + '. Choose one up to ' + formatBytes(props.maxSize) + '.'); return; }
      setLocalErr('');
      var info = { name: f.name, size: f.size, type: f.type, url: '' };
      var finish = function (url) { info.url = url || ''; if (props.value === undefined) setLocal(info); if (props.onFile) props.onFile(f, info.url); };
      if (/^image\//.test(f.type)) { var r = new FileReader(); r.onload = function () { finish(r.result); }; r.onerror = function () { finish(''); }; r.readAsDataURL(f); }
      else finish('');
    }
    function remove() {
      if (props.value === undefined) setLocal(null);
      setLocalErr('');
      if (inputRef.current) inputRef.current.value = '';
      if (props.onRemove) props.onRemove();
    }
    var msgId = id + '-msg';
    var zone = file
      ? h('div', { className: 'cm-upload-file' },
          file.url ? h('img', { src: file.url, alt: '', className: 'cm-upload-thumb' }) : h('span', { className: 'cm-upload-fileicon' }, h(Icon, { name: 'file' })),
          h('div', { className: 'cm-upload-fileinfo' },
            h('span', { className: 'cm-upload-filename' }, file.name),
            file.size ? h('span', { className: 'cm-upload-filesize' }, formatBytes(file.size)) : null),
          h('button', { type: 'button', className: 'cm-btn cm-btn-ghost cm-btn-sm', onClick: remove, disabled: props.disabled, 'aria-label': 'Remove ' + file.name }, 'Remove'))
      : h('label', {
          htmlFor: id,
          className: cx('cm-upload-zone', dragging && 'cm-upload-drag', props.disabled && 'cm-upload-disabled'),
          onDragOver: function (e) { if (props.disabled) return; e.preventDefault(); setDragging(true); },
          onDragLeave: function () { setDragging(false); },
          onDrop: function (e) { if (props.disabled) return; e.preventDefault(); setDragging(false); take(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]); }
        },
          h('input', {
            id: id, ref: inputRef, type: 'file', className: 'cm-upload-input', accept: props.accept, disabled: props.disabled,
            'aria-invalid': error ? 'true' : undefined, 'aria-describedby': msgId,
            onChange: function (e) { take(e.target.files && e.target.files[0]); }
          }),
          h('span', { className: 'cm-upload-cta' }, h(Icon, { name: 'upload' }), props.cta || 'Upload or drop file here'),
          props.hint ? h('span', { className: 'cm-upload-hint' }, props.hint) : null);
    return h('div', { className: cx('cm-field', 'cm-upload', error && 'cm-field-error', props.disabled && 'cm-field-disabled', props.className) },
      props.label ? h(file ? 'span' : 'label', file ? { className: 'cm-label' } : { className: 'cm-label', htmlFor: id }, props.label) : null,
      zone,
      h('div', { className: 'cm-meta', id: msgId, 'aria-live': 'polite' },
        error ? h('span', { className: 'cm-meta-msg' }, h(Icon, { name: 'alert' }), error) : null)
    );
  }

  function Chip(props) {
    return h('button', {
      type: 'button', role: props.role || 'radio', className: cx('cm-chip', props.className),
      'aria-checked': props.selected ? 'true' : 'false', tabIndex: props.tabIndex,
      disabled: props.disabled, onClick: props.onClick, onKeyDown: props.onKeyDown, ref: props.innerRef
    }, props.children);
  }

  /* Single-select tone picker: a radio group drawn as chips. Arrow keys move and select. */
  function ChipGroup(props) {
    var options = props.options || [];
    var s = useState(props.defaultValue || (options[0] && options[0].value));
    var value = props.value !== undefined ? props.value : s[0];
    var refs = useRef([]);
    var labelId = 'cm' + useId().replace(/:/g, '') + '-l';
    function pick(v) { if (props.value === undefined) s[1](v); if (props.onChange) props.onChange(v); }
    function onKey(e, i) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = (i + d + options.length) % options.length;
      pick(options[n].value);
      if (refs.current[n]) refs.current[n].focus();
    }
    var selIndex = Math.max(0, options.findIndex(function (o) { return o.value === value; }));
    return h('div', { className: cx('cm-chipgroup', props.className) },
      h('div', { className: 'cm-chipgroup-label', id: labelId }, props.label),
      h('div', { className: 'cm-chips', role: 'radiogroup', 'aria-labelledby': labelId },
        options.map(function (o, i) {
          return h(Chip, {
            key: o.value, selected: o.value === value, disabled: props.disabled || o.disabled,
            tabIndex: i === selIndex ? 0 : -1, onClick: function () { pick(o.value); },
            onKeyDown: function (e) { onKey(e, i); }, innerRef: function (el) { refs.current[i] = el; }
          }, o.label);
        })
      )
    );
  }

  function ResultCard(props) {
    var s = useState(false), copied = s[0], setCopied = s[1];
    var t = useRef(null);
    useEffect(function () { return function () { clearTimeout(t.current); }; }, []);
    var parts = props.parts && props.parts.length ? props.parts : null;
    var fullText = parts ? parts.map(function (p) { return p.text; }).join('\n\n') : props.text;
    function copy() {
      var done = function () { setCopied(true); clearTimeout(t.current); t.current = setTimeout(function () { setCopied(false); }, 2000); if (props.onCopy) props.onCopy(fullText); };
      try { navigator.clipboard.writeText(fullText).then(done, done); } catch (e) { done(); }
    }
    var refine = props.refineOptions || [];
    var busy = !!props.refining;
    var co = useState(false), customOpen = co[0], setCustomOpen = co[1];
    var ct = useState(''), customText = ct[0], setCustomText = ct[1];
    var inputId = 'cm' + useId().replace(/:/g, '') + '-custom';
    function submitCustom() {
      var v = customText.trim();
      if (!v) return;
      if (props.onRefine) props.onRefine('custom', v);
      setCustomOpen(false); setCustomText('');
    }
    function cancelCustom() { setCustomOpen(false); setCustomText(''); }
    return h('article', { className: cx('cm-card', props.className), 'aria-label': props.label, 'aria-busy': busy ? 'true' : undefined },
      h('div', { className: 'cm-card-head' },
        h('span', { className: 'cm-card-title' },
          h('span', { className: 'cm-eyebrow' }, props.label, props.note ? h('span', { className: 'cm-card-note' }, ' · ' + props.note) : null),
          props.badge ? h('span', { className: 'cm-card-badge' }, props.badge) : null),
        copied
          ? h('span', { className: 'cm-copied', role: 'status' }, h(Icon, { name: 'check' }), 'Copied')
          : h(IconButton, { icon: 'copy', label: 'Copy ' + (props.label || 'text'), size: 'sm', onClick: copy, disabled: busy })
      ),
      busy
        ? h('div', { className: 'cm-card-refining', role: 'status' },
            h('span', { className: 'cm-skel' }), h('span', { className: 'cm-skel', style: { width: '60%' } }),
            h('span', { style: srOnly }, 'Refining ' + (props.label || 'option')))
        : parts
          ? h('dl', { className: 'cm-card-parts' }, parts.map(function (p, i) {
              return h('div', { key: i, className: 'cm-card-part' }, h('dt', null, p.label), h('dd', null, p.text));
            }))
          : h('p', { className: 'cm-card-text' }, props.text),
      (props.rationale && !busy) ? h('p', { className: 'cm-card-why' }, h(Icon, { name: 'sparkle' }), h('span', null, props.rationale)) : null,
      (props.maxChars && !busy && !parts) ? (function () {
        var n = (props.text || '').length, over = n - props.maxChars;
        return h('p', { className: cx('cm-card-count', over > 0 && 'cm-card-count-over') },
          over > 0 ? h(Icon, { name: 'alert' }) : null,
          n + ' / ' + props.maxChars + ' characters' + (over > 0 ? ' · ' + over + ' over the limit' : ''));
      })() : null,
      (refine.length || props.onUndo || props.allowCustom) ? h('div', { className: 'cm-card-actions', role: 'group', 'aria-label': 'Refine ' + (props.label || 'option') },
        refine.map(function (o) {
          return h('button', { key: o.value, type: 'button', className: 'cm-refine', disabled: busy, onClick: function () { setCustomOpen(false); if (props.onRefine) props.onRefine(o.value); } },
            o.icon ? h(Icon, { name: o.icon }) : null, o.label);
        }),
        props.allowCustom ? h('button', { type: 'button', className: 'cm-refine', disabled: busy, 'aria-expanded': customOpen ? 'true' : 'false', 'aria-controls': inputId, onClick: function () { setCustomOpen(!customOpen); } }, 'Other') : null,
        props.onUndo ? h('button', { type: 'button', className: 'cm-refine cm-refine-undo', disabled: busy, onClick: props.onUndo }, 'Undo') : null
      ) : null,
      (props.allowCustom && customOpen && !busy) ? h('form', { className: 'cm-card-custom', onSubmit: function (e) { e.preventDefault(); submitCustom(); } },
        h('label', { htmlFor: inputId, style: srOnly }, 'What should change in ' + (props.label || 'this option')),
        h('input', {
          id: inputId, className: 'cm-input cm-card-custom-input', type: 'text', autoFocus: true, value: customText,
          placeholder: props.customPlaceholder || 'What should change? e.g. Mention the cart is saved',
          onChange: function (e) { setCustomText(e.target.value); },
          onKeyDown: function (e) { if (e.key === 'Escape') { e.preventDefault(); cancelCustom(); } }
        }),
        h('button', { type: 'submit', className: 'cm-btn cm-btn-primary cm-btn-md', disabled: !customText.trim() }, 'Apply'),
        h('button', { type: 'button', className: 'cm-btn cm-btn-ghost cm-btn-md', onClick: cancelCustom }, 'Cancel')
      ) : null
    );
  }

  function ResultSkeleton(props) {
    var lines = props.lines || 2;
    var rows = [];
    for (var i = 0; i < lines; i++) rows.push(h('span', { key: i, className: 'cm-skel', style: { width: i === lines - 1 ? '60%' : '100%' } }));
    return h('div', { className: 'cm-card', 'aria-hidden': 'true', style: { minHeight: 96 } },
      h('span', { className: 'cm-skel cm-skel-eyebrow', style: { marginBottom: 8 } }), rows);
  }

  function Toast(props) {
    return h('div', { className: cx('cm-toast', props.className), role: 'status' },
      h(Icon, { name: props.icon || 'check' }), h('span', null, props.children));
  }

  function EmptyState(props) {
    return h('div', { className: cx('cm-empty', props.className) },
      h('span', { className: 'cm-empty-icon' }, h(Icon, { name: props.icon || 'sparkle' })),
      h('h3', { className: 'cm-empty-title' }, props.title),
      props.children ? h('p', { className: 'cm-empty-text' }, props.children) : null,
      props.action || null
    );
  }

  /* Logo B, "three options": a rounded blue-main square holding three white pills.
     At 20px and below it switches to the two-pill favicon cut so it stays legible. */
  function LogoMark(props) {
    var size = props.size || 32;
    var ground = props.inverse ? '#ffffff' : 'var(--blue-main, #004fc5)';
    var ink = props.inverse ? 'var(--blue-main, #004fc5)' : '#ffffff';
    var pills = size <= 20
      ? [[9, 12, 30, 9], [9, 27, 20, 9]]
      : [[11, 12, 26, 6], [11, 21, 18, 6], [11, 30, 22, 6]];
    return h('svg', { width: size, height: size, viewBox: '0 0 48 48', 'aria-hidden': 'true', focusable: 'false', style: { display: 'block', flex: 'none' } },
      h('rect', { width: 48, height: 48, rx: 12, style: { fill: ground } }),
      pills.map(function (p, i) { return h('rect', { key: i, x: p[0], y: p[1], width: p[2], height: p[3], rx: p[3] / 2, style: { fill: ink } }); })
    );
  }

  function Logo(props) {
    var size = props.size || 32;
    var variant = props.variant || 'lockup';
    if (variant === 'mark') {
      return h('span', { className: cx('cm-logo', props.className), role: 'img', 'aria-label': 'Copymopy' }, h(LogoMark, { size: size, inverse: props.inverse }));
    }
    return h('span', { className: cx('cm-logo', props.inverse && 'cm-logo-inverse', props.className), style: { gap: Math.round(size * 0.3) + 'px' } },
      h(LogoMark, { size: size, inverse: props.inverse }),
      h('span', { className: 'cm-logo-word', style: { fontSize: Math.round(size * 0.66) + 'px', lineHeight: Math.round(size * 0.75) + 'px' } }, 'Copymopy')
    );
  }

  window.Copymopy = Object.assign(window.Copymopy || {}, {
    Logo: Logo,
    Dropdown: Dropdown,
    Uploader: Uploader,
    Button: Button, IconButton: IconButton, TextField: TextField, TextArea: TextArea, Chip: Chip, ChipGroup: ChipGroup,
    ResultCard: ResultCard, ResultSkeleton: ResultSkeleton, Toast: Toast, EmptyState: EmptyState, Icon: Icon
  });
})();
