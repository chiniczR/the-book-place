import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom' //don't need to specify localhost url in axios http address

//style
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.css';
import './index.css';

if (window.location.toString().includes('contact') && document.getElementById('contactTab')) {
	// alert("In contact")
	if (!document.getElementById('contactTab').classList.contains('active')) {
		document.getElementById('contactTab').classList.add('active')
	}
	document.getElementById('contactTab').classList.remove('active')
}
else if (window.location.toString().includes('catalog') && document.getElementById('catalogTab')) {
	// alert("In catalog")
	if (!document.getElementById('catalogTab').classList.contains('active')) {
		document.getElementById('catalogTab').classList.add('active')
	}
	document.getElementById('contactTab').classList.remove('active')
	document.getElementById('aboutTab').classList.remove('active')
}
else if (window.location.toString().includes('usermgmt') && document.getElementById('userMgmtTab')) {
	// alert("In catalog")
	if (!document.getElementById('userMgmtTab').classList.contains('active')) {
		document.getElementById('userMgmtTab').classList.add('active')
	}
	if (document.getElementById('catalogTab')) {
		document.getElementById('catalogTab').classList.remove('active')
	}
	document.getElementById('contactTab').classList.remove('active')
	document.getElementById('aboutTab').classList.remove('active')
}
else if ((window.location.toString().includes('login') || window.location.toString().includes('sign-up')
|| window.location.toString().includes('cart')) && document.getElementById('aboutTab')) {
		document.getElementById('contactTab').classList.remove('active')
		document.getElementById('aboutTab').classList.remove('active')
}
else if (document.getElementById('aboutTab')) {
	if (!document.getElementById('aboutTab').classList.contains('active')) {
		document.getElementById('aboutTab').classList.add('active')
	}
	document.getElementById('contactTab').classList.remove('active')
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
)
