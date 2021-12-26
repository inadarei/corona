ifeq ($(OS),Windows_NT)
	CHECKOUT_BIN:=bin/checkout.exe
else
	UNAME_S:=$(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		CHECKOUT_BIN:=bin/checkout-linux
	endif
	ifeq ($(UNAME_S),Darwin)
		CHECKOUT_BIN:=bin/checkout-mac
	endif
endif


.PHONY: zcheckout-data
zcheckout-data:
	- rm -rf covid-19-data/
	- @${CHECKOUT_BIN}

.PHONY: checkout-data
checkout-data:
	- curl -o covid-19-data/us-states.csv https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-states.csv

.PHONY: format-data
format-data:
	- . venv/bin/activate && ./corona-numbers.py && deactivate

.PHONY: refresh-data
refresh-data: checkout-data format-data	
