import React from 'react';
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const weekday = require('dayjs/plugin/weekday')

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(weekday)

export const locales = require('dayjs/locale.json')

export const getTimestamp = () => {
  return Date.now()
}

export const displayRelativeDate = (timestamp) => {
  return dayjs(timestamp).fromNow()
}

export const displayDate = (timestamp) => {
  return dayjs(timestamp).format("dddd, LL")
}
export const DateElem = ({timestamp}) => {
  return <time dateTime={dayjs(timestamp).format('YYYY-MM-DDTHH:mm:ss')}>
    {displayRelativeDate(timestamp)}
  </time>
}


dayjs.locale(require('dayjs/locale/af'), null, true);
dayjs.locale(require('dayjs/locale/ar-dz'), null, true);
dayjs.locale(require('dayjs/locale/am'), null, true);
dayjs.locale(require('dayjs/locale/ar-iq'), null, true);
dayjs.locale(require('dayjs/locale/ar-kw'), null, true);
dayjs.locale(require('dayjs/locale/ar-ly'), null, true);
dayjs.locale(require('dayjs/locale/ar-ma'), null, true);
dayjs.locale(require('dayjs/locale/ar-sa'), null, true);
dayjs.locale(require('dayjs/locale/ar-tn'), null, true);
dayjs.locale(require('dayjs/locale/ar'), null, true);
dayjs.locale(require('dayjs/locale/az'), null, true);
dayjs.locale(require('dayjs/locale/be'), null, true);
dayjs.locale(require('dayjs/locale/bg'), null, true);
dayjs.locale(require('dayjs/locale/bm'), null, true);
dayjs.locale(require('dayjs/locale/bi'), null, true);
dayjs.locale(require('dayjs/locale/bn-bd'), null, true);
dayjs.locale(require('dayjs/locale/bn'), null, true);
dayjs.locale(require('dayjs/locale/bo'), null, true);
dayjs.locale(require('dayjs/locale/br'), null, true);
dayjs.locale(require('dayjs/locale/bs'), null, true);
dayjs.locale(require('dayjs/locale/ca'), null, true);
dayjs.locale(require('dayjs/locale/cs'), null, true);
dayjs.locale(require('dayjs/locale/cv'), null, true);
dayjs.locale(require('dayjs/locale/cy'), null, true);
dayjs.locale(require('dayjs/locale/da'), null, true);
dayjs.locale(require('dayjs/locale/de-at'), null, true);
dayjs.locale(require('dayjs/locale/de-ch'), null, true);
dayjs.locale(require('dayjs/locale/de'), null, true);
dayjs.locale(require('dayjs/locale/dv'), null, true);
dayjs.locale(require('dayjs/locale/el'), null, true);
dayjs.locale(require('dayjs/locale/en-au'), null, true);
dayjs.locale(require('dayjs/locale/en-ca'), null, true);
dayjs.locale(require('dayjs/locale/en-gb'), null, true);
dayjs.locale(require('dayjs/locale/en-ie'), null, true);
dayjs.locale(require('dayjs/locale/en-il'), null, true);
dayjs.locale(require('dayjs/locale/en-in'), null, true);
dayjs.locale(require('dayjs/locale/en-nz'), null, true);
dayjs.locale(require('dayjs/locale/en-sg'), null, true);
dayjs.locale(require('dayjs/locale/en-tt'), null, true);
dayjs.locale(require('dayjs/locale/eo'), null, true);
dayjs.locale(require('dayjs/locale/en'), null, true);
dayjs.locale(require('dayjs/locale/es-do'), null, true);
dayjs.locale(require('dayjs/locale/es-mx'), null, true);
dayjs.locale(require('dayjs/locale/es'), null, true);
dayjs.locale(require('dayjs/locale/et'), null, true);
dayjs.locale(require('dayjs/locale/eu'), null, true);
dayjs.locale(require('dayjs/locale/fa'), null, true);
dayjs.locale(require('dayjs/locale/fi'), null, true);
dayjs.locale(require('dayjs/locale/fo'), null, true);
dayjs.locale(require('dayjs/locale/fr-ca'), null, true);
dayjs.locale(require('dayjs/locale/fr-ch'), null, true);
dayjs.locale(require('dayjs/locale/fr'), null, true);
dayjs.locale(require('dayjs/locale/fy'), null, true);
dayjs.locale(require('dayjs/locale/ga'), null, true);
dayjs.locale(require('dayjs/locale/gd'), null, true);
dayjs.locale(require('dayjs/locale/gl'), null, true);
dayjs.locale(require('dayjs/locale/gom-latn'), null, true);
dayjs.locale(require('dayjs/locale/gu'), null, true);
dayjs.locale(require('dayjs/locale/he'), null, true);
dayjs.locale(require('dayjs/locale/hi'), null, true);
dayjs.locale(require('dayjs/locale/hr'), null, true);
dayjs.locale(require('dayjs/locale/ht'), null, true);
dayjs.locale(require('dayjs/locale/hu'), null, true);
dayjs.locale(require('dayjs/locale/hy-am'), null, true);
dayjs.locale(require('dayjs/locale/id'), null, true);
dayjs.locale(require('dayjs/locale/it-ch'), null, true);
dayjs.locale(require('dayjs/locale/is'), null, true);
dayjs.locale(require('dayjs/locale/ja'), null, true);
dayjs.locale(require('dayjs/locale/it'), null, true);
dayjs.locale(require('dayjs/locale/ka'), null, true);
dayjs.locale(require('dayjs/locale/jv'), null, true);
dayjs.locale(require('dayjs/locale/kk'), null, true);
dayjs.locale(require('dayjs/locale/km'), null, true);
dayjs.locale(require('dayjs/locale/ko'), null, true);
dayjs.locale(require('dayjs/locale/kn'), null, true);
dayjs.locale(require('dayjs/locale/ku'), null, true);
dayjs.locale(require('dayjs/locale/ky'), null, true);
dayjs.locale(require('dayjs/locale/lb'), null, true);
dayjs.locale(require('dayjs/locale/lo'), null, true);
dayjs.locale(require('dayjs/locale/lv'), null, true);
dayjs.locale(require('dayjs/locale/lt'), null, true);
dayjs.locale(require('dayjs/locale/me'), null, true);
dayjs.locale(require('dayjs/locale/mi'), null, true);
dayjs.locale(require('dayjs/locale/mk'), null, true);
dayjs.locale(require('dayjs/locale/ml'), null, true);
dayjs.locale(require('dayjs/locale/mn'), null, true);
dayjs.locale(require('dayjs/locale/mr'), null, true);
dayjs.locale(require('dayjs/locale/ms-my'), null, true);
dayjs.locale(require('dayjs/locale/ms'), null, true);
dayjs.locale(require('dayjs/locale/mt'), null, true);
dayjs.locale(require('dayjs/locale/my'), null, true);
dayjs.locale(require('dayjs/locale/nb'), null, true);
dayjs.locale(require('dayjs/locale/ne'), null, true);
dayjs.locale(require('dayjs/locale/nl-be'), null, true);
dayjs.locale(require('dayjs/locale/nn'), null, true);
dayjs.locale(require('dayjs/locale/nl'), null, true);
dayjs.locale(require('dayjs/locale/pa-in'), null, true);
dayjs.locale(require('dayjs/locale/oc-lnc'), null, true);
dayjs.locale(require('dayjs/locale/pt-br'), null, true);
dayjs.locale(require('dayjs/locale/pl'), null, true);
dayjs.locale(require('dayjs/locale/pt'), null, true);
dayjs.locale(require('dayjs/locale/rn'), null, true);
dayjs.locale(require('dayjs/locale/ro'), null, true);
dayjs.locale(require('dayjs/locale/ru'), null, true);
dayjs.locale(require('dayjs/locale/es-us'), null, true);
dayjs.locale(require('dayjs/locale/es-pr'), null, true);
dayjs.locale(require('dayjs/locale/sd'), null, true);
dayjs.locale(require('dayjs/locale/si'), null, true);
dayjs.locale(require('dayjs/locale/sk'), null, true);
dayjs.locale(require('dayjs/locale/sl'), null, true);
dayjs.locale(require('dayjs/locale/sq'), null, true);
dayjs.locale(require('dayjs/locale/sr-cyrl'), null, true);
dayjs.locale(require('dayjs/locale/sr'), null, true);
dayjs.locale(require('dayjs/locale/ss'), null, true);
dayjs.locale(require('dayjs/locale/sv-fi'), null, true);
dayjs.locale(require('dayjs/locale/sv'), null, true);
dayjs.locale(require('dayjs/locale/sw'), null, true);
dayjs.locale(require('dayjs/locale/te'), null, true);
dayjs.locale(require('dayjs/locale/ta'), null, true);
dayjs.locale(require('dayjs/locale/tet'), null, true);
dayjs.locale(require('dayjs/locale/tg'), null, true);
dayjs.locale(require('dayjs/locale/tk'), null, true);
dayjs.locale(require('dayjs/locale/tl-ph'), null, true);
dayjs.locale(require('dayjs/locale/tlh'), null, true);
dayjs.locale(require('dayjs/locale/th'), null, true);
dayjs.locale(require('dayjs/locale/tr'), null, true);
dayjs.locale(require('dayjs/locale/tzl'), null, true);
dayjs.locale(require('dayjs/locale/tzm-latn'), null, true);
dayjs.locale(require('dayjs/locale/tzm'), null, true);
dayjs.locale(require('dayjs/locale/ug-cn'), null, true);
dayjs.locale(require('dayjs/locale/uk'), null, true);
dayjs.locale(require('dayjs/locale/ur'), null, true);
dayjs.locale(require('dayjs/locale/uz-latn'), null, true);
dayjs.locale(require('dayjs/locale/uz'), null, true);
dayjs.locale(require('dayjs/locale/vi'), null, true);
dayjs.locale(require('dayjs/locale/x-pseudo'), null, true);
dayjs.locale(require('dayjs/locale/yo'), null, true);
dayjs.locale(require('dayjs/locale/zh-cn'), null, true);
dayjs.locale(require('dayjs/locale/zh-hk'), null, true);
dayjs.locale(require('dayjs/locale/zh-tw'), null, true);
dayjs.locale(require('dayjs/locale/zh'), null, true);
dayjs.locale(require('dayjs/locale/rw'), null, true);
dayjs.locale(require('dayjs/locale/se'), null, true);

