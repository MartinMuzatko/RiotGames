<sold>
	<sold-menu>
	</sold-menu>
	<sold-game if={ quest != false }>
	</sold-game>
</sold>

<sold-menu>

	<div if={ !quest }>
		<h1>Sold!</h1>
		<nav>
			<div onclick={ parent.setQuest } each={quest in quests}>
				<h2>{ quest.title }</h2>
				<p> { quest.description } </p>
			</div>
		</nav>
	</div>

	this.quest = false

	setQuest(e) {
		this.quest = e.item.quest.quest
		this.parent.tags['sold-game'].quest = e.item.quest.quest
	}


	this.quests = [
		{
			"title" : "One Million Frenzy",
			"description" : "How long does it take to make a Million? You go and find out!",
			"quest" : { 
				"money" : 1000000,
				"time"	: 0,
				"maxSales" : Infinity 
			}
		},
		{
			"title" : "5 Minute StockMarket",
			"description" : "Only 5 Minutes to get as much as possible",
			"quest" : { 
				"money" : Infinity,
				"time"	: 5*60,
				"maxSales" : Infinity 
			}
		},
		{
			"title" : "Limited Stocks",
			"description" : "A Millionaire after 30 Sales? Live the dream of quick money.",
			"quest" : { 
				"money" : 1000000,
				"time"	: 0,
				"maxSales" : 30
			}
		},
	]

</sold-menu>


<sold-game>
	<div class="goal">
		Houses: { houses.length } <br>
		Sales: { sales }
		Time:  { interval > 60 ? Math.floor(interval / 60) + 'm' : ''} { interval % 60 }s 
	</div>
	<div class="money">
		Money: { money.commarize() } { currency } 
	</div>

	<div class="houses">
		<div each={ house in houses } onclick={ parent.buy } class="stock { belong : house.own } { cantbuy : parent.money < house.value  }" name="market">	
			{ house.own == true ? 'Sell' : 'Buy' } for 
			<br> { house.value.commarize() } { parent.currency }
			<small if={ house.own == true }> Bought at { house.boughtAt.commarize() } { parent.currency } </small>
		</div>
		
	</div>


	<script>
		this.money = 100
		this.currency = '$'
		this.interval = 0
		this.sales = 0
		this.quest = false
		this.start = false
		this.houses = [
			{
				"value" : 70,
				"own" : true
			},
			{
				"value" : 400,
				"own" : false
			}
		]

		function commarize() 
		{
			var parts = this.toString().split(".")
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	
			return parts.join(".")
		}

		Number.prototype.commarize = commarize
		String.prototype.commarize = commarize

		function random(min, max) 
		{
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

		function chance(percent) 
		{
			return random(0,100) <= percent ? true : false
		}

		buy(e) {
			var house = e.item.house
			if (house.own == true)
			{
				this.money += house.value
				house.value = parseInt(this.money / random(2,10))
				this.sales += 1
				if (this.houses.length < 20)
				{
					this.houses.push(
						{
							"value" : parseInt(random(this.money / 10, this.money)),
							"own" : false
						}
					)
				}
				house.own = false
				if (this.money > this.quest.money)
				{

				}
			}
			else if (house.own == false)
			{
				if (this.money > house.value)
				{
					this.money -= house.value
					house.boughtAt = house.value
					house.own = true
				}
			}
			this.money = parseInt(this.money)

		}

		this.calcChance = function()
		{
			for ( house in this.houses)
			{
				var house = this.houses[house]
				var value = house.value
				var status = []
				if (chance(40 + random(0, 25)))
				{
					if (chance(70 + random(-10, 10)))
					{
						value += random(house.value / 8, house.value / 3)
						status.push('good ' + value)
					}
					if (chance(25 + random(-10, 10)))
					{
						value -= random(house.value / 4, house.value / 1.5 )
						status.push('bad ' + value)
					}
					if (chance(10 + random(-10, 10)))
					{
						value -= random(house.value / 1.5, house.value )
						status.push('negative ' + value)
					}
					if (chance(3 + random(0, 4)))
					{
						value += random(house.value * 1.5, house.value * 8 ) + random(40, 400)
						status.push('jackpot ' + value )
					}
					var diff = value - house.value
					console.log(house.value + ' + ' + diff + ' status:' + status.join(', '))

					house.value = parseInt(value)
					if (house.value < 1)
					{
						house.value = random(5, 20)
					}
				}
			}
		}

		this.uValues = function()
		{
			if ( this.quest )
			{
				if (this.start == false)
				{
					this.interval = this.quest.time
					this.start = true
				}

				if ( this.quest.time > 0 )
				{
					this.interval -= 1				
				}
				else
				{
					this.interval += 1
				}
				this.calcChance()
				this.update()
			}

		}

		this.on(
			'mount',
			function()
			{
				setInterval(
					function()
					{
						this.uValues()
					}.bind(this), 
					1000
				)
			}
		)
	</script>
</sold-game>