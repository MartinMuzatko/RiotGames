<game>

	<div class="info">
		<div>Money: { money.commarize() }</div>
		<div onclick={earn}>Earn</div>
	</div>
	<hr>
	<div>
		<div onclick={parent.buy} name="{item.title}" class="item { available: item.amount > 0}" each={ title, item in items }>
			<h3>{title} - {item.amount}</h3>
			<span>{ item.price.commarize() }$</span>
			<span>{ item.earn*item.amount }$ / { item.interval }s</span>
			<div class="progress">
				<div style="width:{ (parent.interval % item.interval) / item.interval * 100 }%"></div>
			</div>
		</div>
		
	</div>

	<script>

		function commarize()
		{
			var parts = this.toString().split(".")
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

			return parts.join(".")
		}

		String.prototype.commarize = commarize
		Number.prototype.commarize = commarize


		this.money = 0
		this.moneyMultiplier = 1

		this.items = 
		{
			"Printer" : {
				"amount" : 0,
				"price" : 10,
				"earn"	: 2,
				"interval" : 5
			},

			"Business Man" : {
				"amount" : 0,
				"price" : 50,
				"earn"	: 10,
				"interval" : 10
			},

			"Phishing Ads" : {
				"amount" : 0,
				"price" : 200,
				"earn"	: 10,
				"interval" : 1
			},

			"Printer Warehous" : {
				"amount" : 0,
				"price" : 2000,
				"earn"	: 800,
				"interval" : 120
			},

			"Hacker Network" : {
				"amount" : 0,
				"price" : 7700,
				"earn"	: 400,
				"interval" : 2
			},

			"Mafia" : {
				"amount" : 0,
				"price" : 15000,
				"earn"	: 20000,
				"interval" : 60
			},
		}

		buy(e) {
			var item = this.items[e.item.title]
			if (this.money >= item.price)
			{
				item.amount += 1
				this.money -= item.price
			}
		}


		earn(e) {
			this.money += this.moneyMultiplier
		}

		this.interval = 1

		this.doInterval = function()
		{
			setInterval(
				function()
				{
					this.interval += 1
					for (item in this.items)
					{
						var element = this.items[item]
						if (this.interval % element.interval == 0)
						{
							this.money += element.earn * element.amount
							this.update()
						}
					}
				}.bind(this),
				1000)
		}

		this.on(
			'mount',
			function()
			{
				this.doInterval()
			}
		)
	</script>



</game>