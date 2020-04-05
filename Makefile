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


.PHONY: checkout-data
checkout-data:
	- rm -rf covid-19-data/
	- @${CHECKOUT_BIN}

.PHONY: format-data
format-data:
	- ./corona-numbers.py

.PHONY: refresh-data
refresh-data: checkout-data format-data	