console.log("=== Library Dashboard Script ===");
// sweetalert js script
const $favoriteButton = document.querySelector(".favorite-button");
$favoriteButton.addEventListener("click", () => {
    // Swal.fire("SweetAlert2 is working!");
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
});

// floating ui js script
const { computePosition, autoUpdate, offset, flip, shift } = window.FloatingUIDOM;
const $infoBtn = document.querySelector("#info-btn");
const $tip = document.querySelector("#tip");
let stopAutoUpdate = null;

function updateTip() {
    computePosition($infoBtn, $tip, {
        placement: "top",
        middleware: [offset(8), flip(), shift({ padding: 8 })]
    }).then(({ x, y }) => {
        Object.assign($tip.style, { left: `${x}px`, top: `${y}px` });
    });
}

function showTip() {
    $tip.classList.add("show");
    stopAutoUpdate = autoUpdate($infoBtn, $tip, updateTip);
}

function hideTip() {
    $tip.classList.remove("show");
    if (stopAutoUpdate) {
        stopAutoUpdate();
        stopAutoUpdate = null;
    }
}

[["mouseenter", showTip], ["mouseleave", hideTip], ["focus", showTip], ["blur", hideTip]]
    .forEach(([event, handler]) => $infoBtn.addEventListener(event, handler));

// tom select js script
const $kategoriResult = document.querySelector("#kategori-result");
new TomSelect("#kategori",{
    plugins: ['remove_button'],
    placeholder: "Pilih kategori...",
	persist: false,
	createOnBlur: true,
	create: true,
    onChange(values) {
        $kategoriResult.textContent = values.length !== 0
            ? `Dipilih: ${values.join(", ")}`
            : "Belum ada pilihan";
    }
});


// flatpickr js script
new flatpickr('#tanggal', {
    // enableTime: true,
    mode: "range",// rentang tangga;
    dateFormat: "d-F-Y H:i",  // m buat short month, F buat full month
    locale: "id"
});

// chart js
const ctx = document.getElementById('Chart');
new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }
});


// tabulator js
//define some sample data
 var tabledata = [
 	{id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
 	{id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
 	{id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
 	{id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
 	{id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
 ];

 //ganti target div dengan id "table" menjadi tabulator
//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#table", {
 	height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
 	data:tabledata, //assign data to table
 	layout:"fitColumns", //fit columns to width of table (optional)
 	columns:[ //Define Table Columns
	 	{title:"Name", field:"name", width:150},
	 	{title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
	 	{title:"Favourite Color", field:"col"},
	 	{title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
 	],
});

//trigger an alert message when the row is clicked
table.on("rowClick", function(e, row){ 
	alert("Row " + row.getData().id + " Clicked!!!!");
});
