<game>

	/*
		Idea Game
		---------
		What simple browser games are possible?
		
	*/

	<div class="goal">
		Houses: { houses.length } <br>
		Time:  { interval > 60 ? Math.floor(interval / 60) + 'm' : ''} { interval % 60 }s 
	</div>
	<div class="money">
		Money: { money.commarize() } { currency } 
	</div>

	<div class="houses">
		<div each={ house in houses } onclick={ parent.buy } class="stock { belong : house.own } { cantbuy : parent.money < house.value  }" name="market">	
			{ house.own == true ? 'sell' : 'buy' } for { house.value.commarize() } { parent.currency }
		</div>
		
	</div>


	<script>
		this.money = 100
		this.currency = '$'
		this.interval = 0
		this.houses = [
			{
				"value" : 20,
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
				house.value = this.money / random(2,10)
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
			}
			else if (house.own == false)
			{
				if (this.money > house.value)
				{
					this.money -= house.value
					house.own = true 
				}
			}
			this.money = parseInt(this.money)

		}


		this.uValues = function()
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
				this.update()
			}

		}

		this.on(
			'mount',
			function()
			{
				window.xx = this.houses
				setInterval(
					function()
					{
						this.interval += 1
						this.uValues()
					}.bind(this), 
					1000
				)
			}
		)
	</script>
</game>