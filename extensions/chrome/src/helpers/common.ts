export const delay = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// Credit: https://stackoverflow.com/questions/18151877/javascript-shorten-large-numbers-force-decimal-places-and-choose-to-represent
export const abbreviate = (num: number, maxPlaces: number, forcePlaces: any, forceLetter: any) => {
  num = Number(num)
  forceLetter = forceLetter || false
  if(forceLetter !== false) {
    return annotate(num, maxPlaces, forcePlaces, forceLetter)
  }
  var abbr
  if(num >= 1e12) {
    abbr = 'T'
  }
  else if(num >= 1e9) {
    abbr = 'B'
  }
  else if(num >= 1e6) {
    abbr = 'M'
  }
  else if(num >= 1e3) {
    abbr = 'K'
  }
  else {
    abbr = ''
  }
  return annotate(num, maxPlaces, forcePlaces, abbr)
}

const annotate = (num: number, maxPlaces: any, forcePlaces: any, abbr: string) => {
  // set places to false to not round
  let rounded: any = 0
  switch(abbr) {
    case 'T':
      rounded = num / 1e12
      break
    case 'B':
      rounded = num / 1e9
      break
    case 'M':
      rounded = num / 1e6
      break
    case 'K':
      rounded = num / 1e3
      break
    case '':
      rounded = num
      break
  }
  if(maxPlaces !== false) {
    var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
    if(test.test(('' + rounded))) {
      rounded = rounded.toFixed(maxPlaces)
    }
  }
  if(forcePlaces !== false) {
    rounded = Number(rounded).toFixed(forcePlaces)
  }
  return rounded + abbr
}