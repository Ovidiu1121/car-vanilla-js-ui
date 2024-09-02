export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `
     <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div>  

    	<h1>Cars</h1>

    <button class="button">Add car</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Brand</th>
				<th>Price</th>
				<th>Horse Power</th>
				<th>Fabrication year</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `
    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7164/api/v1/Car/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        //console.log(data);
        attachCars(data.carList);

    }).catch(error => {

        load.classList = "";

        console.error('Error fetching data:', error);

        appendAlert(error, "danger");
    });

    button.addEventListener("click", (eve) => {
        CreateAddCarPage();
    });

    table.addEventListener("click", (eve) => {

        if (eve.target.classList.contains("updateCar")) {
            api(`https://localhost:7164/api/v1/Car/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let car = {
                    brand: data.brand,
                    price: data.price,
                    horse_power: data.horse_power,
                    fabrication_year: data.fabrication_year
                }

                CreateUpdatePage(car, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("Car has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("Car has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("Car has been ADDED with success!", "success");
    }

}

export function CreateAddCarPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Car</h1>
    <form>
        <p class="brand-container">
            <label for="brand">Brand</label>
            <input name="brand" type="text" id="brand">
            <a class="brandErr">Brand required!</a>
        </p>
        <p class="price-container">
            <label for="price">Price</label>
            <input name="price" type="text" id="price">
            <a class="priceErr">Price required!</a>
        </p>
        <p class="horsePower-container">
            <label for="horsePower">Horse Power</label>
            <input name="horsePower" type="text" id="horsePower">
            <a class="horsePowerErr">Horse Power required!</a>
        </p>
         <p class="fabricationYear-container">
            <label for="genhorsePowerre">Fabrication Year</label>
            <input name="fabricationYear" type="text" id="fabricationYear">
            <a class="fabricationYearErr">Fabrication Year required!</a>
        </p>
        <div class="createCar">
         <a href="#">Create New Car</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createCar");

    button.addEventListener("click", (eve) => {
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateCar("create");
    })

}

export function CreateUpdatePage(car, idCar) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Car</h1>
    <form>
        <p>
            <label for="brand">Brand</label>
            <input name="brand" type="text" id="brand" value="${car.brand}">
             <a class="brandErr">Brand required!</a>
        </p>
         <p >
             <label for="fabricationYear">Fabrication Year</label>
            <input name="fabricationYear" type="text" id="fabricationYear" value="${car.fabrication_year}">
             <a class="fabricationYearErr">Fabrication Year required!</a>
        </p>
        <p>
            <label for="price">Price</label>
            <input name="price" type="text" id="price" value="${car.price}">
             <a class="priceErr">Price required!</a>
        </p>
        <p>
            <label for="horsePower">Horse Power</label>
            <input name="horsePower" type="text" id="horsePower" value="${car.horse_power}">
             <a class="horsePowerErr">Horse Power required!</a>
        </p>


        <div class="submitUpdate">
         <a href="#">Update Car</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete Car</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let brandinput = document.getElementById("brand");
    let fabricationyearinput = document.getElementById("fabricationYear");

    brandinput.disabled = true;
    fabricationyearinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateCar("update", idCar);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7164/api/v1/Car/delete/${idCar}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);

                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(car) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td  class="updateCar">${car.id}</td>
				<td>${car.price}</td>
				<td>${car.brand}</td>
				<td>${car.horse_power}</td>
				<td>${car.fabrication_year}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachCars(cars) {

    let lista = document.querySelector("thead");

    cars.forEach(car => {

        let tr = createRow(car);
        lista.appendChild(tr);

    });

    return lista;

}

function createUpdateCar(request, idCar) {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

    let brand = document.getElementById("brand").value;
    let price = document.getElementById("price").value;
    let horsePower = document.getElementById("horsePower").value;
    let fabricationYear = document.getElementById("fabricationYear").value;

    let brandError = document.querySelector(".brandErr");
    let priceError = document.querySelector(".priceErr");
    let horsePowerError = document.querySelector(".horsePowerErr");
    let fabricationYearError = document.querySelector(".fabricationYearErr");

    let errors = [];

    if (brand == '') {

        errors.push("Brand");

    } else if (brandError.classList.contains("beDisplayed") && brand !== '') {

        errors.pop("Brand");
        brandError.classList.remove("beDisplayed");
    }

    if (price == '') {

        errors.push("Price");

    } else if (priceError.classList.contains("beDisplayed") && price !== '') {

        errors.pop("Price");
        priceError.classList.remove("beDisplayed");
    }

    if (horsePower == '') {

        errors.push("HorsePower");


    } else if (horsePowerError.classList.contains("beDisplayed") && horsePower !== '') {

        errors.pop("HorsePower");
        horsePowerError.classList.remove("beDisplayed");

    }

    if (fabricationYear == '') {

        errors.push("FabricationYear");

    } else if (fabricationYearError.classList.contains("beDisplayed") && fabricationYear !== '') {

        errors.pop("FabricationYear");
        fabricationYearError.classList.remove("beDisplayed");

    }

    if (!isNumber(horsePower) && horsePower != '') {

        errors.push("HorsePower2");
    }
    else if (isNumber(horsePower)) {

        errors.pop("HorsePower2");

    } else if (horsePowerError.classList.contains("beDisplayed") && horsePower !== '') {

        errors.pop("HorsePower2");
        horsePowerError.classList.remove("beDisplayed");
    }

    if (!isNumber(fabricationYear) && fabricationYear != '') {

        errors.push("FabricationYear2");

    }
    else if (isNumber(fabricationYear)) {

        errors.pop("FabricationYear2");

    } else if (fabricationYearError.classList.contains("beDisplayed") && fabricationYear !== '') {

        errors.pop("FabricationYear2");
        fabricationYearError.classList.remove("beDisplayed");
    }

    if (errors.length == 0) {

        let car = {
            brand: brand,
            price: price,
            horse_power: horsePower,
            fabrication_year: fabricationYear
        }

        if (request === "create") {
            api("https://localhost:7164/api/v1/Car/create", "POST", car)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7164/api/v1/Car/update/${idCar}`, "PUT", car)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    } else {

        errors.forEach(err => {

            if (err.includes("Brand")) {

                brandError.classList.add("beDisplayed");
            }

            if (err.includes("Price")) {

                priceError.classList.add("beDisplayed");
            }

            if (err.includes("HorsePower")) {

                horsePowerError.classList.add("beDisplayed");
            }

            if (err.includes("FabricationYear")) {

                fabricationYearError.classList.add("beDisplayed");
            }

            if (err.includes("FabricationYear2")) {
                fabricationYearError.classList.add("beDisplayed")
                fabricationYearError.textContent = "Only numbers";
            }

            if (err.includes("HorsePower2")) {
                horsePowerError.classList.add("beDisplayed")
                horsePowerError.textContent = "Only numbers";
            }

        })

    }

}