let inputs = document.querySelectorAll('[type="file"]');
Array.prototype.forEach.call(inputs, function(input){
  let label	 = input.nextElementSibling,
      labelVal = label.innerHTML;
  input.addEventListener('change', function(e){
    let fileName = '';
    if( this.files && this.files.length > 1 )
      fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
    else
      fileName = e.target.value.split( '\\' ).pop();
		if( fileName )
      label.nextElementSibling.innerHTML = fileName;
    else
      label.innerHTML = labelVal;
	});

  input.addEventListener('focus', () => { input.classList.add( 'focus' ); });
  input.addEventListener('blur', () => { input.classList.remove( 'focus' ); });
});

let dates = document.querySelectorAll('[data-type="date"]');

for (const date of dates) {
  IMask(date, {
    mask: Date,
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        placeholderChar: 'д',
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        placeholderChar: 'м',
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        placeholderChar: 'г',
        from: 1999,
        to: 2200,
        maxLength: 4,
      }
    },

    min: new Date(1999, 0, 1),
    max: new Date(2200, 0, 1),

    autofix: true,
    lazy: false,
    overwrite: true
  });
}

let phones = document.querySelectorAll('[type="tel"]');

for(const phone of phones){
  IMask(phone, {
    mask: '+{7} (000) 000-00-00',
    pattern: '+{7} (000) 000-00-00',
    lazy: false
  })
}
