(function()
{
	freeboard.loadDatasourcePlugin({
		"type_name"   : "dweet_v2_hour_storage",
		"display_name": "Dweet V2 Hour Storage",
        "description" : "Returns last hour of data from dweet storage",
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


		function get_last_hour(token, thing_name, master_lock)
		{
			make_get_request("https://dweetpro.io/v2/dweets/hour?thing=" + thing_name + "&key=" + master_lock + "&&",
				["X-DWEET-AUTH"],
				[token],
				updateCallback,
				print_res
				)
		}

		function get_data(user, pass, thing_name, master_lock)
		{
			login_user(user, 
				pass, 
				function get_token(raw)
				{
					var json_obj = JSON.parse(raw);
					get_last_hour(json_obj.LOCAL.token, thing_name, master_lock);
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
				get_data(currentSettings.username, currentSettings.password, currentSettings.thing_name, currentSettings.master_lock);
			}, interval);
		}

		self.onSettingsChanged = function(newSettings)
		{
			currentSettings = newSettings;
		};

		self.updateNow = function()
		{
			get_data(currentSettings.username, currentSettings.password, currentSettings.thing_name, currentSettings.master_lock);
		};

		self.onDispose = function()
		{
			clearInterval(refreshTimer);
			refreshTimer = undefined;
		};

		createRefreshTimer(5000);
	}
}());