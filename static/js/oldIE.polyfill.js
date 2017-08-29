/*global document */
/**
 * define document.querySelector & document.querySelectorAll for IE7
 *
 * A not very fast but small hack. The approach is taken from
 * http://weblogs.asp.net/bleroy/archive/2009/08/31/queryselectorall-on-old-ie-versions-something-that-doesn-t-work.aspx
 *
 */
(function () {
	var
		style = document.createStyleSheet(),
		select = function (selector, maxCount) {
			var
				all = document.all,
				l = all.length,
				i,
				resultSet = [];

			style.addRule(selector, "foo:bar");
			for (i = 0; i < l; i += 1) {
				if (all[i].currentStyle.foo === "bar") {
					resultSet.push(all[i]);
					if (resultSet.length > maxCount) {
						break;
					}
				}
			}
			style.removeRule(0);
			return resultSet;

		};

	//  be rly sure not to destroy a thing!
	if (document.querySelectorAll || document.querySelector) {
		return;
	}

	document.querySelectorAll = function (selector) {
		return select(selector, Infinity);
	};
	document.querySelector = function (selector) {
		return select(selector, 1)[0] || null;
	};
}());
