create table visitRecord(
	id int auto_increment primary key,
	host varchar(100) not null,
	pathname varchar(500),
	visitTime timestamp not null,
	visitLastS int not null default 0,
	visiterIPV4 varchar(15),
	visiterIPV6 varchar(39),
	httpHead varchar(1000) not null
);