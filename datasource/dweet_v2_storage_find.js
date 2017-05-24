(function()
{
	freeboard.loadDatasourcePlugin({
		"type_name"   : "dweet_v2_find_storage",
		"display_name": "Dweet V2 Find Storage",
        "description" : "Returns dweets matching parameters given",
		"settings"    : [
			{
				"name"         : "username",
				"display_name" : "Username",
				"type"         : "text",
				"description"  : "Username",
                "required" : true
			},
			{
				"name"         : "password",
				"display_name" : "Password",
				"type"         : "text",
				"description"  : "Password",
                "required" : true
			},
			{
				"name"         : "thing_name",
				"display_name" : "Thing Name",
				"type"         : "text",
				"description"  : "Name of Thing",
                "required" : true
			},
			{
				"name"         : "master_lock",
				"display_name" : "Master Lock",
				"type"         : "text",
				"description"  : "Master Lock",
                "required" : true
			},
			{
				"name"         : "attribute",
				"display_name" : "Data Attribute",
				"type"         : "text",
				"description"  : "Data value of interest",
                "required" : true
			},
            {
				"name"        : "comparator",
				"display_name": "Comparator", 
				"type"        : "option",
				"required" : true,
				"options"     : 
				[
					{
                        "name" : "Greater Than",
						"value": "gt"
					},
					{
						"name" : "Less Than",
						"value": "lt"
					},
					{
						"name" : "Greater Than or Equal to",
						"value": "gte"
					},
					{
						"name" : "Less Than or Equal to",
						"value": "lte"
					},
					{
						"name" : "Equal to",
						"value": "eq"
					}					
				]
			},
			{
				"name"         : "value",
				"display_name" : "Compared Value",
				"type"         : "text",
				"description"  : "Value the attribute is compared to",
                "required" : true
			}
		],
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			newInstanceCallback(new myDatasourcePlugin(settings, updateCallback));
		}
	});

	var myDatasourcePlugin = function(settings, updateCallback)
	{
		var self = this;

		var currentSettings = settings;

		function print_res(res)
		{
			console.log(res);
		}

		function make_get_request(url, headers1, headers2, success, failure)
		{
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					if (req.status === 200)
						success(req.responseText); 
					else
						failure(req.responseText);
				}
			};
		req.open("GET", url, true);   
		for (i = 0; i < headers1.length; ++i)
			req.setRequestHeader(headers1[i], headers2[i]);
		req.send(null);
		}

		function make_post_request(url, query, headers1, headers2, success, failure)
		{
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					if (req.status === 200)
						success(req.responseText); 
					else
						failure(req.responseText);
				}
			};
		req.open("POST", url, true);   
		for (i = 0; i < headers1.length; ++i)
			req.setRequestHeader(headers1[i], headers2[i]);
		req.send(query);
		}

		function login_user(user, pass, success)
		{
		make_post_request("https://dweetpro.io/v2/users/login",'{"username": "' + user + '","password": "' + pass + '","company": ""}', 
			["Accept", "Content-Type"],
			["application/json", "application/json"],
			success,
			print_res);	
		}

		function get_find(token, thing_name, master_lock, attribute, comparator, value)
		{
			make_get_request("https://dweetpro.io/v2/dweets/find?thing=" + thing_name + "&key=" + master_lock + "&p=" + attribute + "&c=" + comparator + "&v=" + value + "&",
				["X-DWEET-AUTH"],
				[token],
				updateCallback,
				print_res
				)
		}

		function get_data(user, pass, thing_name, master_lock, attribute, comparator, value)
		{
			login_user(user, 
				pass, 
				function get_token(raw)
				{
					var json_obj = JSON.parse(raw);
					get_find(json_obj.LOCAL.token, thing_name, master_lock, attribute, comparator, value);
				})
		}

		var refreshTimer;

		function createRefreshTimer(interval)
		{
			if(refreshTimer)
			{
				clearInterval(refreshTimer);
			}

			refreshTimer = setInterval(function()
			{
				get_data(currentSettings.username, currentSettings.password, currentSettings.thing_name, currentSettings.master_lock, currentSettings.attribute, currentSettings.comparator, currentSettings.value);
			}, interval);
		}

		self.onSettingsChanged = function(newSettings)
		{
			currentSettings = newSettings;
		};

		self.updateNow = function()
		{
			get_data(currentSettings.username, currentSettings.password, currentSettings.thing_name, currentSettings.master_lock, currentSettings.attribute, currentSettings.comparator, currentSettings.value);
		};

		self.onDispose = function()
		{
			clearInterval(refreshTimer);
			refreshTimer = undefined;
		};

		createRefreshTimer(5000);
	}
}());