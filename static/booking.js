function submit_booking_form(event, form) {
	event.preventDefault();


	// TODO validate form 
	// - consent
	if (!document.getElementById('consent').checked){
		document.getElementById('consent').classList.add('is-invalid');
		return;
	}
	if (!document.getElementById('first-aid-consent').checked){
		document.getElementById('first-aid-consent').classList.add('is-invalid');
		return;
	}
	// - at least one of Fri/sat
	//
	// 
	if (!document.getElementById('friday').checked && !document.getElementById('saturday').checked) {
		document.getElementById('friday').classList.add('is-invalid');
		document.getElementById('saturday').classList.add('is-invalid');
		document.getElementById('session-warning').style.display = 'inline-block';
		return;
	}

	// clear any previous success/error messages
	document.getElementById('email-success').style.display = 'none';
	document.getElementById('email-fail').style.display = 'none';

	// juggle the buttons
	document.getElementById("form-submit").style.display = 'none';
	document.getElementById('form-submitted').style.display = 'inline-block';

	// Send to data.willowfen.co.uk
	//
	//
	const jsonFormData = {};
	for (const pair of new FormData(form)) {
		console.log(pair);
		jsonFormData[pair[0]] = pair[1];
	}
	console.log(jsonFormData);
	var json = JSON.stringify(jsonFormData);

	var request = new XMLHttpRequest();
	request.onreadystatechange=function() {
		if (request.readyState == 4 && request.status == 200) {
			document.getElementById("email-success").style.display = "inline-block";
			document.getElementById('form-submitted').style.display = 'none';
		} else if (request.readyState == 4) {
			document.getElementById("email-fail").style.display = "inline-block";
	document.getElementById("form-submit").style.display = 'inline-block';

		}
	}
	request.open("POST","https://data.willowfen.co.uk/booking",true);
	request.setRequestHeader("Content-type","application/json");
	request.send(json);
}

function remove_child_row(e) {
	var button = e.srcElement;
	console.log(button.dataset.child);
	var child_num = parseInt(button.dataset.child);
	const boxes = document.querySelectorAll('.child_'+child_num);

	boxes.forEach(box => {
	  box.remove();
	});

	const addChild = document.querySelector("#child_add");
	if (addChild) {
		addChild.dataset.children = addChild.dataset.children - 1;
	}

	// re-enable the checkbox
	if (addChild.dataset.children > 1) {
		prev_remove_button = document.getElementById("remove_child_"+addChild.dataset.children);
		prev_remove_button.classList.remove('btn-outline-dark');
		prev_remove_button.classList.add('btn-danger');
		prev_remove_button.classList.remove('disabled');
		prev_remove_button.addEventListener("click", remove_child_row);
	}


}
function add_child_row(e) {

	e.preventDefault();
	var button = e.srcElement;
	child_num = parseInt(button.dataset.children) + 1;
	document.getElementById("child-add-row").insertAdjacentHTML('beforebegin', '<div class="col-md-6 child_'+child_num+' form-floating"><input type="text" class="form-control child_'+child_num+'" id="inputEmail4" name="child_name_'+child_num+'" required><label for="inputEmail4" class="form-label child_'+child_num+'">Child Name</label></div><div class="col-md-5 child_'+child_num+' form-floating"><input type="number" class="form-control child_'+child_num+'" id="inputName4" name="child_age_'+child_num+'" required><label for="inputName4" class="form-label child_'+child_num+'">Age</label></div><div class="col-md-1 d-flex align-items-end justify-content-end child_'+child_num+'"><button type="button" class="btn btn-danger float-end child_'+child_num+'" data-child='+child_num+' id="remove_child_'+child_num+'">X</button>');


	//add handler to remove child row
	remove_button = document.querySelector('#remove_child_'+child_num);
	if (remove_button) {
		remove_button.addEventListener("click", remove_child_row);
	}

	if (child_num > 2) {
		// disable the previous button
		prev_button = document.querySelector("#remove_child_"+(child_num-1));
		prev_button.removeEventListener('click',
		remove_child_row,
		);
		prev_button.classList.remove("btn-danger");
		prev_button.classList.add("btn-outline-dark");
		prev_button.classList.add("disabled");

	}

	button.dataset.children = child_num;
}

window.onload = function() {
	console.log("Booking!");
	const bookingForm = document.querySelector("#booking-form");
	if (bookingForm) {
		bookingForm.addEventListener("submit", function(e) {
			submit_booking_form(e, this);
		});
	}

	const addChild = document.querySelector("#child_add");
	if (addChild) {
		addChild.addEventListener("click", add_child_row);
	}

	const friday = document.querySelector("#friday");
	if (friday) {
		friday.addEventListener("click", function(e) {
			//if saturday is checked, uncheck it
			var saturday_box = document.querySelector("#saturday");
			if (saturday_box.checked) {
				saturday.checked = false;
			}
		document.getElementById('session-warning').style.display = 'none';
		document.getElementById('friday').classList.remove('is-invalid');
		document.getElementById('saturday').classList.remove('is-invalid');
		});
	}
	const saturday = document.querySelector("#saturday");
	if (saturday) {
		saturday.addEventListener("click", function(e) {
			//if saturday is checked, uncheck it
			var friday_box = document.querySelector("#friday");
			if (friday_box.checked) {
				friday_box.checked = false;
			}
		document.getElementById('session-warning').style.display = 'none';
		document.getElementById('friday').classList.remove('is-invalid');
		document.getElementById('saturday').classList.remove('is-invalid');
		});
	}

	document.getElementById("book_friday").onclick = function(e) { 
		document.getElementById("friday").checked = true;
		document.getElementById("saturday").checked=false
	};
	document.getElementById("book_saturday").onclick = function(e) { 
		document.getElementById("saturday").checked = true;
		document.getElementById("friday").checked=false;
	};

	document.getElementById("booking-form").onsubmit = function (e) { submit_booking_form(e); };

}


