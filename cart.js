let CartData ={};
const MinCountValue = 1;
const MaxCountValue = 100;
async function AddToCart(itemID) {

        if (CartData[itemID] != null) {
                    
            CartData[itemID][0] = parseInt(CartData[itemID] ?? 0) + 1;
            updateBadgeAndCart(CartData[itemID][1]);
        }
        else
        {
            await fetch('https://dummyjson.com/products/' + itemID)
            .then(res => {
                //store the json result in a variable
                return res.json();
            })
            .then(ItemJson => {
                    
                            var InnerArray = [];
                            InnerArray.push(1);
                            InnerArray.push(ItemJson);
                            CartData[itemID] = InnerArray;
                            updateBadgeAndCart(ItemJson);
            });
        }
     
    
}

function  RemoveFromCart(itemID) {
    if (CartData[itemID][0] > 1) {
        CartData[itemID][0] = CartData[itemID][0] - 1;
        updateBadgeAndCart();
    }
    else
    {
        delete CartData[itemID];
        var CurrentSessionCart = JSON.parse(sessionStorage.getItem('cart'));
        delete CurrentSessionCart[itemID];
        sessionStorage.setItem('cart', JSON.stringify(CurrentSessionCart));
        updateBadgeAndCart();
    }
}



function CountAllItems(){
    let Count = 0;
    for (const [key, value] of Object.entries(CartData)) {
        Count += value[0];
    }
    return Count;
}
function calculateTotalPrice() {
    // Convert CartData's values into an array of [quantity, {price: x}] arrays
    const itemsArray = Object.values(CartData);
    // Use reduce on the array to calculate the total price
    const totalPrice = itemsArray.reduce((sum, item) => sum + (item[1].price * item[0]), 0);
    return parseFloat(totalPrice).toFixed(2) + " E£"; //return totalPrice;
}
function updateBadgeAndCart(){
    const price = document.querySelector('#CartTotalSum');
    const badge = document.querySelector('#badge');
    if(price != null){
        price.innerText = calculateTotalPrice();
    }
    if(badge != null){
        
        if(badge.classList.contains('badge')){
            badge.innerText = CountAllItems();
            //multiply price by count and sum it
           
            // price.innerText = parseInt(price.innerText).toFixed(2);
        }
        else{
            badge.classList.add('badge');
            badge.innerText = CountAllItems();

        }
    }
    PopulateCartPage();
    UpdateSessionStorage();
}

function AddItemToCart(itemID) {

    var SessionCart = JSON.parse(sessionStorage.getItem('cart'));
    if(SessionCart == null){
        SessionCart = {};
        if(SessionCart[itemID] != null){
            SessionCart[itemID]++;
        }
        else{
            SessionCart[itemID]=1;
        }

        sessionStorage.setItem('cart', JSON.stringify(SessionCart));
        AddToCart(itemID);

    }
    else{
        //get the right item
        
        if(SessionCart[itemID] != null){
            SessionCart[itemID]++;
        }
        else{
            SessionCart[itemID]=1;
        }

        sessionStorage.setItem('cart', JSON.stringify(SessionCart));
        AddToCart(itemID);
    }
}
async function SetToCart(itemID , Count){
    
    if (Count<MinCountValue) {
        
        Count = MinCountValue;
        CartData[itemID] = Count;
        RemoveFromCart(itemID);
        console.log(CartData);
        PopulateCartPage();
        UpdateSessionStorage();
        
        
    }else{
        if (Count>MaxCountValue)
            {
                Count = MaxCountValue;
            }
            if (CartData[itemID] != null) {
                            
                CartData[itemID][0] = Count;
                updateBadgeAndCart(CartData[itemID][1]);
            }
            else
            {
                await fetch('https://dummyjson.com/products/' + itemID)
                .then(res => {
                    //store the json result in a variable
                    return res.json();
                })
                .then(ItemJson => {
                        
                    var InnerArray = [];
                    InnerArray.push(Count);
                    InnerArray.push(ItemJson);
                    CartData[itemID] = InnerArray;
                    updateBadgeAndCart(ItemJson);
                    
                });
            }
            
            PopulateCartPage();
            UpdateSessionStorage();
    }
    
}

function UpdateSessionStorage() {
    let simplifiedCartData = {};
    Object.entries(CartData).forEach(([key, CartItem]) => {
        simplifiedCartData[key] = CartItem[0]; // Assuming CartItem[0] is the count
    });
    sessionStorage.setItem('cart', JSON.stringify(simplifiedCartData));
}

//on document load
document.addEventListener('DOMContentLoaded', async function() {
    await checkSession();
    var CartGrid = document.querySelector('.CartGrid');
    if(CartGrid != null && CartData !== null){
        PopulateCartPage();
        
    }
    else{

    }
});

function PopulateCartPage(){
    PopulateSideCart();
    const CartGrid = document.querySelector('.CartGrid');
    if (CartGrid!=null && CartData != null){ 
        CartGrid.innerHTML = '';
        //because CartData is a 2D array and not always filled continuously we need to loop through it using for each
        Object.entries(CartData).forEach(([key, CarItem]) => {

        
            CartGrid.innerHTML += `
            <tr>
            <td>
                <div class="CartItemImage">
                    <img  src="${CarItem[1].thumbnail}"> 
                </div>
            </td>
            <td><div class="ItemName">
                ${CarItem[1].title}</div></td>
            <td><div class="CartTableCenter">${parseFloat(CarItem[1].price).toFixed(2)} E£</div></td>
            <td><div class="CartTableCenter"><div class="CountControlContainer"><i onclick="RemoveFromCart(${CarItem[1].id})" class="fa-solid fa-minus borderedIcon CountControl"></i><input type="number" onchange="SetToCart(${CarItem[1].id},this.value)" class="MidIcon borderedIcon " min="1" max="100" value="${CarItem[0]}"><i onclick="AddToCart(${CarItem[1].id})" class="fa-solid fa-plus borderedIcon CountControl"></i></div></td>
            <td style="position: relative;"><div class="CartTableCenter">${parseFloat(CarItem[1].price * CarItem[0]).toFixed(2)} E£</div> <div onclick="SetToCart(${CarItem[1].id},0)" class="Remove_Link" style="bottom: .5rem;position: absolute;padding: 5px;/*! font-size: 2r; */">Remove</div></td>
        </tr>
            `;
        });
    }
   
       
    

}


  async function checkSession(){
    //if there is data set in the session storage for the cart fetch them and display them
    if(sessionStorage.getItem('cart') != null){
        var SessionCart = JSON.parse(sessionStorage.getItem('cart'));

        //for each item in the cart
        await Object.entries(SessionCart).forEach(([key, CarItem]) => {   
             SetToCart(key,CarItem);
        });
       
    }
    else{

    }
  }

  function clearSession(){
    sessionStorage.removeItem('cart');
  }


function ToggleSideCart(){
    const SideCart = document.querySelector('#HideSideCart');
    SideCart.classList.toggle('HideSideCart');

}

document.querySelector('#HideSideCart').addEventListener('click',
function(event){
    ToggleSideCart();
});
document.querySelector('.SideCart').addEventListener('click',
function(event){
    event.stopPropagation();
});

function ToCart(){
    window.location.href = "cart.html";
}

function PopulateSideCart(){
    var SCGrid = document.querySelector('.SCGrid');
    if(SCGrid != null){
    document.querySelector('.SCGrid').innerHTML = '';
    Object.entries(CartData).forEach(([key, CarItem]) => {
        document.querySelector('.SCGrid').innerHTML += `
                <div class="SCGridItem">
                    <div class="SCGridItemImage">
                        <img  src="${CarItem[1].thumbnail}">
                    </div>
                    <div class="SCGridItemInfo">
                        <div class="SCGridItemName">${CarItem[1].title}</div>
                        <div class="SCGridItemPrice">
                            <div style="font-weight: lighter;"> <span id="Price">${CarItem[0]} x ${CarItem[1].price}</span> <span>E£</span> </div>
                        </div>
                       
                    </div>
                  
                </div>
        `;
    });
    }
}

  
  