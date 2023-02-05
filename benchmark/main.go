package main

func main() {
	if err := Benchmark(); err != nil {
		panic(err)
	}

	select {}
}