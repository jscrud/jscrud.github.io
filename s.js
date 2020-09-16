indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var request;
var db;
// Code for declare database and check browser capibility  
if (!indexedDB)
    console.log("Your Browser does not support IndexedDB");
else {
    request = indexedDB.open("testDBFinal", 25);
    request.onerror = function(event) {
        console.log("Error opening DB", event);
    }
    request.onupgradeneeded = function(event) {
        console.log("Upgrading");
        db = event.target.result;
        let objectStore = db.createObjectStore("students", {
            keyPath: "rollNo",
            autoIncrement: true
        });
    }
    request.onsuccess = function(event) {
        console.log("Success opening DB");
        db = event.target.result;
        console.log(db)
    }
}

function showAllDataMethod() {
    request = db.transaction(["students"], "readonly").objectStore("students").getAll();
    request.onsuccess = () => {
        let obj = request.result
        let table = `<table class="table table-striped">
                        <thead>
                            <th>ID</th><th>First Name</th><th>Last Name</th><th>City</th><th>Mobile</th>
                        </thead><tbody>`;
        $.each(obj, function() {
            no = this['rollNo']
            table += '<tr><td>' + no + '</td><td>' + this['FirstName'] + '</td><td>' + this['LastName'] + '</td><td>' + this['City'] +
                '</td><td>' + this['Mobile'] + `</td><td><button class="btn btn-primary" type=button onclick=edit(` + no + `)>Edit</button>` +
                ` <button class="btn btn-danger" type=button onclick=deleteFn(` + no + `)>Delete</button></td></tr>`;
        });
        table += '</tbody></table>';
        $("#datalist").html(table);
    };
};
// showAllDataMethod();

function edit(id) {
    view(id)
    $('#txtSearch').val(id)
}

show = () => {
    let id = parseInt($('#txtSearch').val());
    view(id);
}

function view(id) {
    request = db.transaction(["students"], "readonly").objectStore("students").get(id);
    request.onsuccess = function(event) {
        let r = request.result;
        if (r != null) {
            $('#firstName').val(r.FirstName);
            $('#lastName').val(r.LastName);
            $('#city').val(r.City);
            $('#mobile').val(r.Mobile);
        } else {
            ClearTextBox();
            alert('Record Does not exist');
        }
    };
}
deleteFn = (id) => {
    db.transaction(["students"], "readwrite").objectStore("students").delete(id);
    alert(' Recored No. ' + id + ' Deleted Successfully !!!');
    showAllDataMethod();
}

function update(id) {
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let city = $('#city').val();
    let mobile = $('#mobile').val();
    let trans = db.transaction(["students"], "readwrite");
    let objectStore = trans.objectStore("students");
    let i = parseInt(id);
    let request = objectStore.get(i);
    request.onsuccess = function(event) {
        request.result.FirstName = firstName;
        request.result.LastName = lastName;
        request.result.City = city;
        request.result.Mobile = mobile;
        objectStore.put(request.result);
        alert('Recored Updated Successfully !!!');
    };
    showAllDataMethod();
}
$(document).ready(() => {
    // debugger;  
    // Code for Add New Record in IndexedDB  
    $("#addBtn").click(function() {
        // debugger;  
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let city = $('#city').val();
        let mobile = $('#mobile').val();
        let transaction = db.transaction(["students"], "readwrite");
        let objectStore = transaction.objectStore("students");
        if (firstName == '' || lastName == '' || city == '' || mobile == '') {
            alert('Khong dc')
            return
        }
        objectStore.add({
            FirstName: firstName,
            LastName: lastName,
            City: city,
            Mobile: mobile
        });
        transaction.oncomplete = function(event) {
            console.log("Success :)");
            $('#result').html("Add: Successfully");
        };
        transaction.onerror = function(event) {
            console.log("Error :)");
            $('#result').html("Add: Error occurs in inserting");
        };
        ClearTextBox();
        showAllDataMethod();
    });
    // Code for Read Data from Indexed on for edit(Single Record)  
    $('#btnShow').click(function() {
        show()
    });
    // Code for Clear text Box  
    $('#clearBtn').click(function() {
        ClearTextBox();
    });

    function ClearTextBox() {
        $('#firstName').val('');
        $('#lastName').val('');
        $('#city').val('');
        $('#mobile').val('');
        $('#txtSearch').val('');
    }
    $('#updateBtn').click(function() {
        let rollNo = parseInt($('#txtSearch').val());
        update(rollNo)
    });
    $('#deleteBtn').click(function() {
        let id = parseInt($('#txtSearch').val());
        deleteFn(id)
    });
    $('#btnShowAll').click(
        () => { showAllDataMethod(); }
    );


    // showAllDataMethod();
    // document.getElementsByTagName('body').onload = function() { showAllDataMethod() }
    // showAllDataMethod();
});