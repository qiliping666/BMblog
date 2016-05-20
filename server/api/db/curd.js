
function whereinit=(where){
	var upwhere=''
	for(let i in where){
		if(upwhere.length==0){
			if(!where[i]['op']){
				where[i]['op']="=";
			}
			upwhere=where[i]['name']+where[i]['op']+where[i]['value'];
		}else{
			upwhere=+(i+where[i]['name']+where[i]['op']+where[i]['value']);
		}
	}
	return upwhere
}
export var insert=function (db,table,data){
	var field="",value='';
	for(let i in data){
		field="`"+i+"`,";
		value="'"+data[i]+"',";
	}
	field=field.slice(0,-1);
	value=value.slice(0,-1);
	var sql="INSERT INTO `"+db+"`.`"+table+"` ("+field+") VALUES ("+value+");";
	return sql;
}
export var updata=function(db,table,data,where){ //{"or":{'name':id,value:1,op:"="},and:{name:11},and:{data:22}}
	if(!where){
		throw('sql条件不能为空');
	}
	var updata=''
	for(let i in data){
		updata="`"+i+"`='"+data[i]+"',";
	}
	updata=updata.slice(0,-1);
	upwhere=whereinit(where);
	var sql="UPDATE `"+table+"` SET "+updata+" WHERE "+upwhere;
	return sql;
}
export var find=function(table,field,where,limit,order){
	var data=''
	for(let i in field){
		data+="`"+field[i]+"`,";
	}
	data=data.slice(0,-1);

	upwhere=whereinit(where);
	if(upwhere){
		wheresql='where='+where;
	}
	if(limit){
		limit=" LIMIT "+limit;
	}else{
		limit='';
	}
	if(order){
		order="order by "+order;
	}else{
		order='';
	}
	var sql="select "+data+" from `"+table+"`"+wheresql+order+limit;
	return sql;
}
export var findone=function(table,field,where,order){
	return find(table,field,where,1,order)
}