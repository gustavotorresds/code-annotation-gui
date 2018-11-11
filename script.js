$(document).ready(function() {
	// Map containing pairs of single line # => grade
	const grades = new Map();

	let activeLine = null;

	$('.code-upload').change(function(event) {
		$('#code-container').html('');

    	const table = $(document.createElement('table'))
    	const file = event.target.files[0];

    	var reader = new FileReader();
	    reader.onload = function(e){
	    	var contents = e.target.result;
	    	var lines = contents.split('\n');
	    	for(let i = 1; i <= lines.length; i++) {
	    		let line = lines[i - 1];

	    		const row = $(document.createElement('tr'));
	    		row.addClass('code-line');
	    		row.attr('id', i);

	    		// We add <pre> to keep tabs showing.
	    		row.html('<td>' + i + '<td><td><pre>' + line + '</pre></td>');

	    		table.append(row);
	    	}
	    	$('#code-container').append(table);
	    };

	    reader.readAsText(file);

	    // HACK: it takes a little for the file to load, so we wait
	    // before adding the listeners.
	    setTimeout(function() {
	    	addEventToCodeLineListeners();
	    }, '1000');
    });

    // Add functionality to set grade to each line
	function addEventToCodeLineListeners() {
		console.log('on it');
		$('.code-line').click(function(event) {
			if(activeLine) {
				$('#' + activeLine).removeClass('active');
			}

			// Target element in <pre>, so we get it's parent's parent.
	    	const row = $(event.target.parentNode.parentNode);
	    	activeLine = row.attr('id');
	    	row.addClass('active');
	    	$('.grade-form').css('display', 'block');
	    	$('#grade-input').focus();
	    });
	}

    $('.grade-form').submit(function(event) {
    	event.preventDefault();

    	$('#' + activeLine).removeClass('active');

    	const grade = event.target.grade.value;
    	grades.set(activeLine, grade);
    	event.target.grade.value = '';

    	$('.grade-form').css('display', 'none');

    	console.log(grades);
    });

    $('.download').click(function(event) {
    	download('hello.tsv', formatContent(grades));
    });

    function download(filename, text) {
	    const element = document.createElement('a');
	    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	    element.setAttribute('download', filename);

	    element.style.display = 'none';
	    document.body.appendChild(element);

	    element.click();

	    document.body.removeChild(element);
	}

	// Each line and respective grade are separated by a tab.
	// Each sample is separated by a breakline character.
	function formatContent(map) {
		let f = "Line\tGrade\n";
		for (var [key, value] of map) {
		  f += (key + '\t' + value + '\n');
		}
		return f;
	};
});