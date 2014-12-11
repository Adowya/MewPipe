angular.module('filters', [])
.filter('nl2br', function() {
	return function(text) {
		if (typeof text === "string"){
			text = text.replace(/&/g, "&amp;");
			text = text.replace(/"/g, "&quot;");
			text = text.replace(/'/g, "&#039;");
			text = text.replace(/</g, "&lt;");
			text = text.replace(/>/g, "&gt;");
			return text.replace(/\n/g, '<br>');
		}else{
			return false;
		}
	};
})
.filter('limit40', function() {
	return function(text) {
		if (typeof text === "string"){
			if(text.length > 40){
				text = text.substr(0,37);
				text = text+" ...";
			}
			return text;
		}else{
			return false;
		}
	};
})
.filter('limit20', function() {
	return function(text) {
		if (typeof text === "string"){
			if(text.length > 20){
				text = text.substr(0,17);
				text = text+" ...";
			}
			return text;
		}else{
			return false;
		}
	};
})
.filter('limit17', function() {
	return function(text) {
		if (typeof text === "string"){
			if(text.length > 17){
				text = text.substr(0,14);
				text = text+" ...";
			}
			return text;
		}else{
			return false;
		}
	};
})
.filter('limit12', function() {
	return function(text) {
		if (typeof text === "string"){
			if(text.length > 12){
				text = text.substr(0,9);
				text = text+" ...";
			}
			return text;
		}else{
			return false;
		}
	};
})
//filter Multiple...
.filter('filterMultiple', ['$filter', function($filter) {
        return function(items, keyObj) {
            var filterObj = {
                data: items,
                filteredData: [],
                applyFilter: function(obj, key) {
                    var fData = [];
                    if (this.filteredData.length === 0)
                        this.filteredData = this.data;
                    if (obj) {
                        var fObj = {};
                        if (angular.isString(obj)) {
                            fObj[key] = obj;
                            fData = fData.concat($filter('filter')(this.filteredData, fObj));
                        } else if (angular.isArray(obj)) {
                            if (obj.length > 0) {
                                for (var i = 0; i < obj.length; i++) {
                                    if (angular.isString(obj[i])) {
                                        fObj[key] = obj[i];
                                        fData = fData.concat($filter('filter')(this.filteredData, fObj));
                                    }
                                }

                            }
                        }
                        if (fData.length > 0) {
                            this.filteredData = fData;
                        }
                    }
                }
            };

            if (keyObj) {
                angular.forEach(keyObj, function(obj, key) {
                    filterObj.applyFilter(obj, key);
                });
            }

            return filterObj.filteredData;
        };
    }]);