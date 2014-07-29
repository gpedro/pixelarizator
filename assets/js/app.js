$(function() {
	var bucketColor = '';
	function updateColors() {
		$.each($('.palette ul li'), function() {
			var current = $(this);
			if(current.data('rgb')) {
				current.css('background-color', current.data('rgb'));
			}
		});

		$('.palette ul li').click(function() {
			bucketColor = $(this).data('rgb');
		});
	}

	updateColors();

	$('#more').click(function() {
		var color = prompt('RGB Color', 'rgb(255, 0, 0)');

		if(color != null) {
			$('<li data-rgb="' + color + '"></li>').appendTo('.palette ul');
			updateColors();
		}

	});

	$('#new-art').click(function() {
		var input = prompt('Type number of rows and cols', '32x32');

		if(input != null) {
			var size = input.split('x');
			var table = '<table cellpadding="10" cellspacing="0">';
			for(var i = 0; i < parseInt(size[0]); i++) {
				table += '<tr>';
				for(var j = 0; j < parseInt(size[1]); j++) {
					table += '<td></td>';
				}
				table += '</tr>';
			}
			table += '</table>';

			$('#container').html('');
			$(table).appendTo('#container');
		}
	});

	$('#container').on('click', 'td', function() {
		$(this).css('background-color', bucketColor);
	});

	$('#done').click(function(e) {
		e.preventDefault();

		var output = '';
		var colors = {};
		$('.palette ul li').each(function(index) {
			output += '$color' + index + ': ' + $(this).data('rgb') + ';\n';
			colors[$(this).data('rgb')] = '$color' + index;
		});

		console.log(colors);

		output += '\nbody {\nbackground-color:#333;\n}\n\n.amazing-art {\nbackground-color: transparent;\nheight: 1em;\nposition: absolute;\nleft: 50%;\ntop: 50%;\nwidth: 1em;\n';
		output += 'box-shadow: \n';

		$('#container tr').each(function(linha) {
			var countColor = $(this).find('td').length;
			var count = $(this).find('td').length;
			if(countColor > 0)
				output += '\n// Linha ' + linha + '\n';

			$(this).find('td').each(function(coluna) {
				var currentColor = $(this).css('background-color');
				console.log(coluna + "/" +currentColor);
				if(currentColor !== 'rgba(0, 0, 0, 0)') {
					output += (Math.floor(count/2) - (count-coluna)) + 'em ' + linha + 'em 0 ' + colors[currentColor] + ',\n';
				}
			});
		});

		output += '}';

		var data = {title: 'amazing art created using gpedro.github.io/pixelarizator', html: '.amazing-art', html_pre_processor: 'haml', css_pre_processor: 'scss', css: output};
		var JSONstring = 
		JSON.stringify(data)
		// Quotes will screw up the JSON
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

		$('#raw').attr('value', JSONstring);
		$('#codepen').submit();

	});
});
