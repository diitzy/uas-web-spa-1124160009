document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('paymentForm');
	const transactionList = document.getElementById('transactionList');
	const totalTransactions = document.getElementById('totalTransactions');
	const totalRevenue = document.getElementById('totalRevenue');
	const avgTransaction = document.getElementById('avgTransaction');

	let transactions = [];
	let currentDiscount = 0;

	const promoCodes = {
		"HEMAT10": { type: "percent", value: 10 },
		"DISKON50": { type: "flat", value: 50000 },
		"GRATISONGKIR": { type: "flat", value: 25000 }
	};

	// Promo code handler
	document.getElementById('applyPromoBtn').addEventListener('click', function () {
		const code = document.getElementById('promoCode').value.trim().toUpperCase();
		const productSelect = form.productSelect;
		const price = parseInt(productSelect.options[productSelect.selectedIndex]?.getAttribute('data-price')) || 0;
		const quantity = parseInt(form.quantity.value) || 1;
		const subtotal = price * quantity;

		const promoMessage = document.getElementById('promoMessage');
		promoMessage.classList.remove('hidden');

		if (promoCodes[code]) {
			const promo = promoCodes[code];
			if (promo.type === "percent") {
				currentDiscount = Math.round(subtotal * (promo.value / 100));
			} else {
				currentDiscount = promo.value;
			}

			promoMessage.textContent = `✅ Promo "${code}" diterapkan. Diskon: Rp ${currentDiscount.toLocaleString('id-ID')}`;
			promoMessage.className = "mt-2 text-sm text-green-600";
			document.getElementById("discountRow").classList.remove("hidden");
			document.getElementById("discount").textContent = `Rp ${currentDiscount.toLocaleString('id-ID')}`;
		} else {
			currentDiscount = 0;
			promoMessage.textContent = `❌ Kode promo tidak valid.`;
			promoMessage.className = "mt-2 text-sm text-red-600";
			document.getElementById("discountRow").classList.add("hidden");
			document.getElementById("discount").textContent = `Rp 0`;
		}

		const totalAmount = Math.max(0, subtotal - currentDiscount);
		document.getElementById("subtotal").textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
		document.getElementById("totalAmount").textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
	});

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const name = form.customerName.value;
		const email = form.customerEmail.value;
		const productSelect = form.productSelect;
		const product = productSelect.options[productSelect.selectedIndex].text;
		const price = parseInt(productSelect.options[productSelect.selectedIndex].getAttribute('data-price'));
		const quantity = parseInt(form.quantity.value);
		const paymentMethod = form.paymentMethod.value;
		const subtotal = price * quantity;
		const total = Math.max(0, subtotal - currentDiscount);

		const newTransaction = {
			name,
			email,
			product,
			price,
			quantity,
			total,
			method: paymentMethod,
			time: new Date().toLocaleString()
		};

		transactions.push(newTransaction);
		updateTransactionList(newTransaction);
		updateStats();

		// Reset diskon setelah transaksi
		currentDiscount = 0;
		document.getElementById("discountRow").classList.add("hidden");
		document.getElementById("discount").textContent = `Rp 0`;
		document.getElementById("promoMessage").classList.add("hidden");
		document.getElementById("promoCode").value = "";
		document.getElementById("subtotal").textContent = `Rp 0`;
		document.getElementById("totalAmount").textContent = `Rp 0`;

		document.getElementById('paymentModal').classList.remove('hidden');

		const paymentDetails = document.getElementById('paymentDetails');
		paymentDetails.innerHTML = `
			<p><strong>Nama:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			<p><strong>Produk:</strong> ${product}</p>
			<p><strong>Jumlah:</strong> ${quantity}</p>
			<p><strong>Total:</strong> Rp ${total.toLocaleString('id-ID')}</p>
		`;

		form.reset();
	});

	function updateTransactionList(trx) {
		const template = document.getElementById('transactionTemplate');
		const clone = template.content.cloneNode(true);

		clone.querySelector('.transaction-customer').textContent = trx.name;
		clone.querySelector('.transaction-product').textContent = trx.product;
		clone.querySelector('.transaction-amount').textContent = `Rp ${trx.total.toLocaleString('id-ID')}`;
		clone.querySelector('.transaction-time').textContent = trx.time;
		clone.querySelector('.transaction-method').textContent = trx.method;

		transactionList.prepend(clone);

		const emptyState = document.getElementById('emptyState');
		if (emptyState) emptyState.classList.add('hidden');
	}

	function updateStats() {
		const totalAmount = transactions.reduce((acc, trx) => acc + trx.total, 0);
		totalTransactions.textContent = transactions.length;
		totalRevenue.textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
		avgTransaction.textContent = `Rp ${Math.round(totalAmount / transactions.length).toLocaleString('id-ID')}`;
	}

	document.getElementById('closeModalBtn').addEventListener('click', () => {
		document.getElementById('paymentModal').classList.add('hidden');
	});

	// Inisialisasi teks toggle saat pertama kali
	const toggleButton = document.getElementById("toggleDarkMode");
	const isDark = document.documentElement.classList.contains("dark");
	toggleButton.innerHTML = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";

	// Load mode dari localStorage
	if (localStorage.theme === "dark") {
		document.documentElement.classList.add("dark");
		toggleButton.innerHTML = "☀️ Mode Terang";
	} else {
		document.documentElement.classList.remove("dark");
		toggleButton.innerHTML = "🌙 Mode Gelap";
	}

	toggleButton.addEventListener("click", function () {
		const htmlEl = document.documentElement;
		const isDark = htmlEl.classList.toggle("dark");
		localStorage.theme = isDark ? "dark" : "light";
		toggleButton.innerHTML = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
	});
});
