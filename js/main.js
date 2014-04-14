
define("products/data", [], [
    {id: 1, name: "Product1"},
    {id: 2, name: "Product2"},
    {id: 3, name: "Product3"},
    {id: 4, name: "Product4"},
    {id: 5, name: "Product5"},
    {id: 6, name: "Product6"}
]);


define("products/listRenderer", [], function() {
	return function render(products) {
		return "<ul>"
			+ products.reduce(function (html, product) {
					return html + "<li data-productid='" + product.id + "'>" + product.name + "</li>";
				}, "")
			+ "</ul>";
	};
});


define("products/listView", ["products/listRenderer"], function(renderer) {
	
	function ProductListView(node, products) {
		this.node = node;
		
		var self = this;
		
		this.$me = $(renderer(products)).appendTo(this.node);
		this.$me.find("[data-productid]").click(function () {
			var productId = $(this).data("productid");
			self.onProductClick(productId);
		});
	}
	
	ProductListView.prototype = {
		onProductClick: function (productId) {
			this.$me.find("[data-productid=" + productId + "]").css("background-color", "grey");
		},
		
		destroy: function () {
			this.$me.remove();
		}
	};
	
	return ProductListView;
});


define("cart/model", [], function () {
	function Cart() {
	}
	
	Cart.prototype = {
		items: []	
	};
	
	return Cart;
});


define("shoppingController", [], function () {
	function ShoppingController(cart) {
		this.cart = cart;
	}
	
	ShoppingController.prototype = {
		selectProduct: function (productId) {
			this.cart.items.push(productId);
			alert("Product " + productId + " selected. Total number: " + this.cart.items.length);
		}
	}
	
	return ShoppingController;
});


define("main", ["products/data", "products/listView", "cart/model", "shoppingController"],
		function (products, ProductsListView, Cart, ShoppingController) {
	
	var container = $("body")[0];
	var productsListView = new ProductsListView(container, products);
	
	var cart = new Cart();
	var shoppingController = new ShoppingController(cart);
	
	// connect productsListView.onProductClick to shoppingController.selectProduct
	var origOnProductClick = productsListView.onProductClick;
	productsListView.onProductClick = function (productId) {
		origOnProductClick.call(productsListView, productId);
		shoppingController.selectProduct(productId);
	};
	
});
