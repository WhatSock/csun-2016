/*!
Visual ARIA Bookmarklet (11/07/2016)
Copyright 2016 Bryan Garaventa (http://whatsock.com/training/matrices/visual-aria.htm)
Part of the ARIA Role Conformance Matrices, distributed under the terms of the Open Source Initiative OSI - MIT License
*/

(function(){

	// For this implementation, a local relative copy of roles.css is loaded instead, so useOffline is still false.
	var useOffline = false,

	// Base path for dynamic loading of individual CSS files, public access should use an absolute url with https instead
	basePath = 'visual-aria/public/',

// Set millisecond interval for dynamically loading supporting CSS files and performing the naming calculation for widget roles
	msInterval = 1000;

	if (!document.getElementById('ws-bm-aria-matrices-lnk')){
		var s = document.createElement('span');
		s.className = 'WS-BM-Loading-Msg';
		s.innerHTML
			= '<span role="alert" style="position: fixed; z-index:10000; color: white; background-color: black; border: inset thick gray; top: 40%; left: 35%; padding: 20px; font-size: 18pt;">Loading Visual ARIA, please wait.</span>';
		document.body.appendChild(s);
	}

	var WSBMInit = function(isTop, useOffline, basePath, msInterval, document, attrs, isNested, check, loaded){

		var trim = function(str){
			if (typeof str !== 'string')
				return '';

			return str.replace(/^\s+|\s+$/g, '');
		}, activeObj = null, activeDObj = null;

		attrs
			= 'aria-disabled,aria-readonly,aria-haspopup,aria-orientation,aria-label,aria-labelledby,aria-describedby,aria-pressed,aria-checked,aria-valuemin,aria-valuemax,aria-valuenow,aria-valuetext,aria-controls,aria-autocomplete,aria-expanded,aria-owns,aria-activedescendant,aria-posinset,aria-setsize,aria-level,role'.split(
				',');
		isNested = function(start, role){
			while (start){
				start = start.parentNode;

				if (start.getAttribute('role') == role)
					return 'true';
			}

			return 'false';
		};

		check = function(nodes, obj, frames, focused, pNode, focusHidden, isSelfRef, isDefTerm){
			if (loaded && loaded.init){
				if (!loaded.comboboxListbox && !document.getElementById('ws-visual-aria-7')
					&& document.querySelectorAll('*[role="combobox"], *[role="listbox"], *[role="option"]').length){
					loaded.comboboxListbox = true;
					loadCSS('7combobox-listbox.css', '7');
				}

				if (!loaded.menuMenubar
					&& !document.getElementById('ws-visual-aria-8')
						&& document.querySelectorAll(
							'*[role="menu"], *[role="menubar"], *[role="menuitem"], *[role="menuitemradio"], *[role="menuitemcheckbox"]').length)
					{
					loaded.menuMenubar = true;
					loadCSS('8menu-menubar.css', '8');
				}

				if (!loaded.radiogroup && !document.getElementById('ws-visual-aria-9')
					&& document.querySelectorAll('*[role="radiogroup"], *[role="radio"]').length){
					loaded.radiogroup = true;
					loadCSS('9radiogroup.css', '9');
				}

				if (!loaded.tablist && !document.getElementById('ws-visual-aria-10')
					&& document.querySelectorAll('*[role="tablist"], *[role="tab"], *[role="tabpanel"]').length){
					loaded.tablist = true;
					loadCSS('10tablist.css', '10');
				}

				if (!loaded.tree && !document.getElementById('ws-visual-aria-11')
					&& document.querySelectorAll('*[role="tree"], *[role="treeitem"]').length){
					loaded.tree = true;
					loadCSS('11tree.css', '11');
				}

				if (!loaded.treegridGridTable
					&& !document.getElementById('ws-visual-aria-12')
						&& document.querySelectorAll(
							'*[role="treegrid"], *[role="grid"], *[role="table"], *[role="rowgroup"], *[role="row"], *[role="columnheader"], *[role="rowheader"], *[role="gridcell"], *[role="cell"]').length)
					{
					loaded.treegridGridTable = true;
					loadCSS('12treegrid-grid-table.css', '12');
				}
			}

			if (loaded && !loaded.init){
				loaded.init = true;
				loadCSS('1roles.css', '1');
				loaded.landmarks = true;
				loadCSS('2landmarks.css', '2');
				loaded.structural = true;
				loadCSS('3structural.css', '3');
				loaded.dialogs = true;
				loadCSS('4dialogs.css', '4');
				loaded.liveRegions = true;
				loadCSS('5live-regions.css', '5');
				loaded.simpleWidgets = true;
				loadCSS('6simple-widgets.css', '6');
			}

			nodes = document.querySelectorAll(
				'input, *[role], img[aria-label], img[aria-labelledby], img[aria-describedby], img[aria-haspopup="true"], img[aria-selected], progress');

			obj = {};

			isSelfRef = function(node, role, ids){
				if (!node || node.nodeType !== 1
					|| !trim(role)
						|| !trim(ids)
							|| ' application banner complementary contentinfo form main navigation region search article directory document list note table toolbar feed log status combobox grid listbox menu menubar radiogroup tablist tabpanel tree group treegrid '.indexOf(
								' ' + role + ' ') === -1)
					return false;

				var isF = false, a = ids.split(' ');

				for (var i = 0; i < a.length; i++){
					if (document.getElementById(a[i]) == node)
						isF = true;
				}

				if (isF)
					node.setAttribute('data-ws-bm-self-ref', 'true');
				return isF;
			};

			isDefTerm = function(ids){
				var isT = true, a = ids.split(' ');

				for (var i = 0; i < a.length; i++){
					var o = document.getElementById(a[i]);

					if (o && o.nodeType === 1 && o.getAttribute('role') != 'term'){
						o.setAttribute('data-ws-bm-dtr-missing', 'true');
						isT = false;
					}
				}
				return isT;
			};

			for (var i = 0; i < nodes.length; i++){
				for (var j = 0; j < attrs.length; j++)
								obj[attrs[j]] = nodes[i].getAttribute(attrs[j]) || null;
				obj['node-name'] = nodes[i].nodeName.toLowerCase();
				obj.tabindex = nodes[i].getAttribute('tabindex');
				obj['input-type'] = obj['node-name'] == 'input' ? nodes[i].getAttribute('type') : null;

				if (obj.role == 'radio')
					obj['role-nested'] = isNested(nodes[i], 'radiogroup');

				else if (obj.role == 'tab')
					obj['role-nested'] = isNested(nodes[i], 'tablist');

				else if (obj.role == 'treeitem')
					obj['role-nested'] = isNested(nodes[i], 'tree');

				isSelfRef(nodes[i], obj.role, obj['aria-labelledby']);

				if (obj.role == 'definition' && obj['aria-labelledby'])
					isDefTerm(obj['aria-labelledby']);

				if (' input img progress '.indexOf(' ' + obj['node-name'] + ' ') !== -1){
					if (pNode != nodes[i].parentNode){
						pNode = nodes[i].parentNode;

						for (var a in obj){
							if (obj[a] || !isNaN(parseInt(obj[a])))
								pNode.setAttribute('data-ws-bm-' + a, obj[a]);

							else
								pNode.removeAttribute('data-ws-bm-' + a);
						}
					}
				}
			}

			focused = document.querySelectorAll('*[aria-describedby]:focus');

			if (focused.length){
				var dbs = focused[0].getAttribute('aria-describedby').split(' ');

				for (var d = 0; d < dbs.length; d++){
					var t = document.getElementById(dbs[d]);

					if (t && t.nodeType === 1)
						t.setAttribute('data-ws-bm-db-match', dbs[d]);
				}
			}

			focused = document.querySelectorAll('*[aria-activedescendant]:focus');
			var fO = null;

			if (focused.length)
				fO = document.getElementById(focused[0].getAttribute('aria-activedescendant'));

			if ((!focused.length || !fO || focused[0] != activeObj || fO != activeDObj)
				&& (activeDObj && activeDObj.nodeType === 1 && activeDObj.getAttribute('data-ws-bm-ad-match'))){
				activeDObj.removeAttribute('data-ws-bm-ad-match');
				activeDObj.removeAttribute('data-ws-bm-ad-invalid');
				activeDObj = null;
			}

			if (fO && fO.nodeType === 1){
				activeObj = focused[0];
				activeDObj = fO;
				var nn = fO.nodeName.toLowerCase(), href = fO.getAttribute('href'), rl = fO.getAttribute('role');

				if (!rl && nn == 'a' && href)
					rl = 'link';

				else if (!rl && nn == 'button')
					rl = 'button';
				fO.setAttribute('data-ws-bm-ad-match', rl);

				if (!rl)
					fO.setAttribute('data-ws-bm-ad-invalid', 'true');
			}

			focusHidden = document.querySelectorAll('*[hidefocus="true"]');

			for (var h = 0; h < focusHidden.length; h++)
							focusHidden[h].removeAttribute('hidefocus');

			frames = document.querySelectorAll('frame, iframe');

			for (var f = 0; f < frames.length; f++){
				try{
					if (frames[f].contentDocument && frames[f].contentDocument.head && !frames[f].contentDocument.WSBMInit){
						frames[f].contentDocument.WSBMInit = WSBMInit;
						frames[f].contentDocument.WSBMInit(false, useOffline, basePath, msInterval, frames[f].contentDocument);
					}
				}
				catch (e){}
			}

			setTimeout(check, msInterval);
		};

		var checkNames = function(){

			var calcNames = function(node){
				if (!node || node.nodeType !== 1)
					return;

				var walkDOM = function(node, fn, refObj){
					if (!node)
						return;

					fn(node, refObj);
					node = node.firstChild;

					while (node){
						walkDOM(node, fn, refObj);
						node = node.nextSibling;
					}
				}, isHidden = function(o, refObj){
					if (o.nodeType !== 1 || o == refObj)
						return false;

					if (o != refObj && ((o.getAttribute && o.getAttribute('aria-hidden') == 'true')
						|| (o.currentStyle && (o.currentStyle['display'] == 'none' || o.currentStyle['visibility'] == 'hidden'))
							|| (document.defaultView && document.defaultView.getComputedStyle && (document.defaultView.getComputedStyle(o,
								'')['display'] == 'none' || document.defaultView.getComputedStyle(o, '')['visibility'] == 'hidden'))
							|| (o.style && (o.style['display'] == 'none' || o.style['visibility'] == 'hidden'))))
						return true;
					return false;
				}, hasParentLabel = function(start, targ, noLabel, refObj){
					if (!start || !targ || start == targ)
						return false;

					while (start){
						start = start.parentNode;

						var rP = start.getAttribute ? start.getAttribute('role') : '';
						rP = (rP != 'presentation' && rP != 'none') ? false : true;

						if (!rP && start.getAttribute
							&& ((!noLabel && trim(start.getAttribute('aria-label'))) || isHidden(start, refObj))){
							return true;
						}

						else if (start == targ)
							return false;
					}

					return false;
				};

				if (isHidden(node, document.body) || hasParentLabel(node, document.body, true, document.body))
					return;

				var accName = '', accDesc = '', desc = '', aDescribedby = node.getAttribute('aria-describedby') || '',
					title = node.getAttribute('title') || '', skip = false, rPresentation = node.getAttribute('role');
				rPresentation = (rPresentation != 'presentation' && rPresentation != 'none') ? false : true;

				var walk = function(obj, stop, refObj){
					var nm = '';

					walkDOM(obj, function(o, refObj){
						if (skip || !o || (o.nodeType === 1 && isHidden(o, refObj)))
							return;

						var name = '';

						if (o.nodeType === 1){
							var aLabelledby = o.getAttribute('aria-labelledby') || '', aLabel = o.getAttribute('aria-label') || '',
								nTitle = o.getAttribute('title') || '', rolePresentation = o.getAttribute('role');
							rolePresentation = (rolePresentation != 'presentation' && rolePresentation != 'none') ? false : true;
						}

						if (o.nodeType === 1
							&& ((!o.firstChild || (o == refObj && (aLabelledby || aLabel))) || (o.firstChild && o != refObj && aLabel))){
							if (!stop && o == refObj && aLabelledby){
								if (!rolePresentation){
									var a = aLabelledby.split(' ');

									for (var i = 0; i < a.length; i++){
										var rO = document.getElementById(a[i]);
										name += ' ' + walk(rO, true, rO) + ' ';
									}
								}

								if (trim(name) || rolePresentation)
									skip = true;
							}

							if (!trim(name) && aLabel && !rolePresentation){
								name = ' ' + trim(aLabel) + ' ';

								if (trim(name) && o == refObj)
									skip = true;
							}

							if (!trim(name)
								&& !rolePresentation && (o.nodeName.toLowerCase() == 'input' || o.nodeName.toLowerCase() == 'select'
									|| o.nodeName.toLowerCase() == 'textarea')
									&& o.id && document.querySelectorAll('label[for="' + o.id + '"]').length){
								var rO = document.querySelectorAll('label[for="' + o.id + '"]')[0];
								name = ' ' + trim(walk(rO, true, rO)) + ' ';
							}

							if (!trim(name) && !rolePresentation && (o.nodeName.toLowerCase() == 'img') && (trim(o.getAttribute('alt')))){
								name = ' ' + trim(o.getAttribute('alt')) + ' ';
							}

							if (!trim(name) && !rolePresentation && nTitle){
								name = ' ' + trim(nTitle) + ' ';
							}
						}

						else if (o.nodeType === 3){
							name = o.data;
						}

						if (name && !hasParentLabel(o, refObj, false, refObj)){
							nm += name;
						}
					}, refObj);

					return nm;
				};

				accName = walk(node, false, node);
				skip = false;

				if (title && !rPresentation){
					if (!trim(accName))
						accName = trim(title);

					else
						desc = trim(title);
				}

				if (aDescribedby && !rPresentation){
					var s = '', d = aDescribedby.split(' ');

					for (var j = 0; j < d.length; j++){
						var rO = document.getElementById(d[j]);
						s += ' ' + walk(rO, true, rO) + ' ';
					}

					if (trim(s))
						desc = s;
				}

				if (trim(desc) && !rPresentation)
					accDesc = desc;

				accName = trim(accName.replace(/\s/g, ' ').replace(/\s\s+/g, ' '));
				accDesc = trim(accDesc.replace(/\s/g, ' ').replace(/\s\s+/g, ' '));

				if (accName == accDesc)
					accDesc = '';

				if (node.nodeName.toLowerCase() == 'input' || node.nodeName.toLowerCase() == 'textarea'
					|| node.nodeName.toLowerCase() == 'img' || node.nodeName.toLowerCase() == 'progress'){
					node.parentNode.setAttribute('data-ws-bm-name-prop', accName);

					node.parentNode.setAttribute('data-ws-bm-desc-prop', accDesc);
				}

				else{
					node.setAttribute('data-ws-bm-name-prop', accName);

					node.setAttribute('data-ws-bm-desc-prop', accDesc);
				}
			};

			var accNames =
				document.querySelectorAll(
					'textarea, input, select, button, a[href], progress, *[role="button"], *[role="checkbox"], *[role="link"], *[role="searchbox"], *[role="scrollbar"], *[role="slider"], *[role="spinbutton"], *[role="switch"], *[role="textbox"], *[role="combobox"], *[role="option"], *[role="menuitem"], *[role="menuitemcheckbox"], *[role="menuitemradio"], *[role="radio"], *[role="tab"], *[role="treeitem"]');

			for (var aN = 0; aN < accNames.length; aN++){
				calcNames(accNames[aN]);
			}

			setTimeout(checkNames, 5000);
		};

		setTimeout(checkNames, 5000);

		if (!useOffline){
			loaded =
							{
							init: false,
							landmarks: false,
							structural: false,
							dialogs: false,
							liveRegions: false,
							simpleWidgets: false,
							comboboxListbox: false,
							menuMenubar: false,
							radiogroup: false,
							tablist: false,
							tree: false,
							treegridGridTable: false
							};

			var loadCSS = function(file, i){
				var l = document.createElement('link');
				l.type = 'text/css';
				l.rel = 'stylesheet';
				l.href = basePath + file;
				l.id = 'ws-visual-aria-' + i;
				document.head.appendChild(l);
			};
		}

		check();
	};

	WSBMInit(true, useOffline, basePath, msInterval, document);

	if (!document.getElementById('ws-bm-aria-matrices-lnk')){
		var m = document.createElement('span');
		m.innerHTML
			= '<span id="ws-bm-aria-matrices-lnk" style="position: fixed; top: 0; left: 0;padding: 3px; border: 1px solid #dedede; background: #f5f5f5; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#f9f9f9\', endColorstr=\'#f0f0f0\'); background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0)); background: -moz-linear-gradient(top,  #f9f9f9, #f0f0f0); border-color: #000; -webkit-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; -moz-box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb; box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #fbfbfb;"><a style="display: inline-block; text-decoration: none; font-size: 10pt; padding: 6px 9px; border: 1px solid #dedede; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; background: #525252; filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#5e5e5e\', endColorstr=\'#434343\'); background: -webkit-gradient(linear, left top, left bottom, from(#5e5e5e), to(#434343)); background: -moz-linear-gradient(top,  #5e5e5e, #434343); border-color: #4c4c4c #313131 #1f1f1f; color: #fff; text-shadow: 0 1px 0 #2e2e2e; -webkit-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; -moz-box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686; box-shadow: 0 1px 1px #afafaf, inset 0 1px 0 #868686;" target="_blank" href="http://whatsock.com/training/matrices/"><span>ARIA Role Matrices</span></a></span>';
		document.body.appendChild(m);
	}
})();