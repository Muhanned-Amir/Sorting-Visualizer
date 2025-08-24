document.addEventListener("DOMContentLoaded", function() {
    //* DOM Elements
    const randomize_array_btn = document.getElementById("randomize_array_btn");
    const sort_btn = document.getElementById("sort_btn");
    const bars_container = document.getElementById("bars_container");
    const select_algo = document.getElementById("algo");
    const speed = document.getElementById("speed");
    const slider = document.getElementById("slider");
    
    //* Some Variables
    let minRange = 1;
    let maxRange = slider.value;
    let numOfBars = slider.value;
    let heightFactor = 4;
    let speedFactor = 50;
    let unsorted_array = [];
    let isSorting = false;
    let algotouse = "bubble";

    //? Creates a random array and renders it as bars when the page loads
    function init() {
        unsorted_array = createRandomArray();
        renderBars(unsorted_array);
    }

    //? Event Listeners
    slider.addEventListener("input", function() {
        if (isSorting) return; //! Prevents user from changing array during sorting
        numOfBars = slider.value;
        maxRange = slider.value;
        bars_container.innerHTML = "";
        unsorted_array = createRandomArray();
        renderBars(unsorted_array);
    });

    //? Updates the speed of animations based on user input
    speed.addEventListener("change", (e) => {
        speedFactor = parseInt(e.target.value);
    });

    //? Updates which algorithm to use when selected from the dropdown
    select_algo.addEventListener("change", function() {
        algotouse = select_algo.value;
    });

    //? Creates a new random array and displays it.
    randomize_array_btn.addEventListener("click", function() {
        if (isSorting) return;
        unsorted_array = createRandomArray();
        bars_container.innerHTML = "";
        renderBars(unsorted_array);
    });

    sort_btn.addEventListener("click", async function() {
        if (isSorting) return;
        isSorting = true;
        disableControls(true);
        
        let sortedArray;
        switch (algotouse) {
            case "bubble":
                sortedArray = await bubbleSort([...unsorted_array]);
                break;
            case "merge":
                sortedArray = await mergeSort([...unsorted_array]);
                break;
            case "insertion":
                sortedArray = await InsertionSort([...unsorted_array]);
                break;
            case "quick":
                sortedArray = await quickSort([...unsorted_array], 0, unsorted_array.length - 1);
                break;
            case "selection":
                sortedArray = await selectionSort([...unsorted_array]);
                break;
            case "heap":
                sortedArray = await heapSort([...unsorted_array]);
                break;
            default:
                sortedArray = await bubbleSort([...unsorted_array]);
        }
        
        //? Update the original array and re-render
        unsorted_array = sortedArray;
        bars_container.innerHTML = "";
        renderBars(unsorted_array);
        
        //? Reset bar colors
        const bars = document.getElementsByClassName("bar");
        for (let bar of bars) {
            bar.classList.remove("compare", "swapping", "pivot", "min");
        }
        
        isSorting = false;
        disableControls(false);
    });

    //! Helper Functions
    function disableControls(disabled) {
        slider.disabled = disabled;
        randomize_array_btn.disabled = disabled;
        sort_btn.disabled = disabled;
        select_algo.disabled = disabled;
    }

    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createRandomArray() {
        let array = new Array(numOfBars);
        for (let i = 0; i < numOfBars; i++) {
            array[i] = randomNum(minRange, maxRange);
        }
        return array;
    }

    //? show bars
    function renderBars(array) {
        bars_container.innerHTML = "";
        for (let i = 0; i < array.length; i++) {
            let bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = array[i] * heightFactor + "px";
            bar.dataset.value = array[i];
            bars_container.appendChild(bar);
        }
    }

    //? Pauses execution for animation timing
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //^ Sorting Algorithms

    // ^ Bubble Sort 
    async function bubbleSort(array) {
        let bars = document.getElementsByClassName("bar");
        let swapped; //?check if there any swaps
        for (let i = 0; i < array.length - 1; i++) { //?outer loop
            swapped = false;
            for (let j = 0; j < array.length - i - 1; j++) {
                bars[j].classList.add("compare");
                bars[j+1].classList.add("compare");
                await sleep(speedFactor);
                
                if (array[j] > array[j + 1]) {
                    swapped = true;
                    bars[j].classList.add("swapping");
                    bars[j+1].classList.add("swapping");
                    
                    [array[j], array[j+1]] = [array[j+1], array[j]];
                    
                    bars[j].style.height = array[j] * heightFactor + "px";
                    bars[j+1].style.height = array[j+1] * heightFactor + "px";
                    await sleep(speedFactor);
                    
                    bars[j].classList.remove("swapping");
                    bars[j+1].classList.remove("swapping");
                }
                
                bars[j].classList.remove("compare");
                bars[j+1].classList.remove("compare");
            }
            bars[array.length - i - 1].classList.add("sorted");
            if (!swapped) break; //! Early exit if no swaps occurred
        }
        return array;
    }

    // ^ Insertion Sort
    async function InsertionSort(array) {
        let bars = document.getElementsByClassName("bar");
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            bars[i].classList.add("compare");
            
            while (j >= 0 && array[j] > key) {
                bars[j].classList.add("swapping");
                array[j + 1] = array[j];
                bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
                await sleep(speedFactor);
                
                bars[j].classList.remove("swapping");
                j--;
            }
            
            if (array[j + 1] !== key) {
                array[j + 1] = key;
                bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
            }
            
            bars[i].classList.remove("compare");
            bars[j + 1].classList.add("sorted");
            await sleep(speedFactor);
        }
        return array;
    }

    // ^ Selection Sort
    async function selectionSort(array) {
        let bars = document.getElementsByClassName("bar");
        for (let i = 0; i < array.length - 1; i++) {
            let minIndex = i;
            bars[minIndex].classList.add("min");
            
            for (let j = i + 1; j < array.length; j++) {
                bars[j].classList.add("compare");
                await sleep(speedFactor);
                
                if (array[j] < array[minIndex]) {
                    bars[minIndex].classList.remove("min");
                    minIndex = j;
                    bars[minIndex].classList.add("min");
                }
                
                bars[j].classList.remove("compare");
            }
            
            if (minIndex !== i) {
                bars[i].classList.add("swapping");
                bars[minIndex].classList.add("swapping");
                
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                
                bars[i].style.height = array[i] * heightFactor + "px";
                bars[minIndex].style.height = array[minIndex] * heightFactor + "px";
                await sleep(speedFactor);
                
                bars[i].classList.remove("swapping");
                bars[minIndex].classList.remove("swapping");
            }
            
            bars[minIndex].classList.remove("min");
            bars[i].classList.add("sorted");
        }
        bars[array.length - 1].classList.add("sorted");
        return array;
    }

    // ^ Quick Sort
    async function quickSort(array, low, high) {
        if (low < high) {
            let bars = document.getElementsByClassName("bar");
            let pivotIndex = await partition(array, low, high, bars);
            
            await quickSort(array, low, pivotIndex - 1);
            await quickSort(array, pivotIndex + 1, high);
            
            for (let i = low; i <= high; i++) {
                bars[i].classList.add("sorted");
            }
        }
        return array;
    }

    async function partition(array, low, high, bars) {
        let pivot = array[high];
        bars[high].classList.add("pivot");
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            bars[j].classList.add("compare");
            await sleep(speedFactor);
            
            if (array[j] < pivot) {
                i++;
                
                if (i !== j) {
                    bars[i].classList.add("swapping");
                    bars[j].classList.add("swapping");
                    
                    [array[i], array[j]] = [array[j], array[i]];
                    
                    bars[i].style.height = array[i] * heightFactor + "px";
                    bars[j].style.height = array[j] * heightFactor + "px";
                    await sleep(speedFactor);
                    
                    bars[i].classList.remove("swapping");
                    bars[j].classList.remove("swapping");
                }
            }
            
            bars[j].classList.remove("compare");
        }
        
        bars[i+1].classList.add("swapping");
        bars[high].classList.add("swapping");
        
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        
        bars[i+1].style.height = array[i+1] * heightFactor + "px";
        bars[high].style.height = array[high] * heightFactor + "px";
        await sleep(speedFactor);
        
        bars[i+1].classList.remove("swapping");
        bars[high].classList.remove("swapping");
        bars[high].classList.remove("pivot");
        
        return i + 1;
    }

    // ^ Merge Sort
    async function mergeSort(array, startIdx = 0) {
        if (array.length <= 1) return array;
        
        let bars = document.getElementsByClassName("bar");
        const mid = Math.floor(array.length / 2);
        const left = array.slice(0, mid);
        const right = array.slice(mid);
        
        await mergeSort(left, startIdx);
        await mergeSort(right, startIdx + mid);
        
        for (let i = 0; i < left.length; i++) {
            bars[startIdx + i].classList.add("compare");
        }
        for (let i = 0; i < right.length; i++) {
            bars[startIdx + mid + i].classList.add("compare");
        }
        await sleep(speedFactor);
        
        let i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                array[k] = left[i];
                i++;
            } else {
                array[k] = right[j];
                j++;
            }
            
            bars[startIdx + k].style.height = array[k] * heightFactor + "px";
            bars[startIdx + k].classList.add("swapping");
            await sleep(speedFactor);
            bars[startIdx + k].classList.remove("swapping");
            k++;
        }
        
        while (i < left.length) {
            array[k] = left[i];
            bars[startIdx + k].style.height = array[k] * heightFactor + "px";
            i++;
            k++;
        }
        
        while (j < right.length) {
            array[k] = right[j];
            bars[startIdx + k].style.height = array[k] * heightFactor + "px";
            j++;
            k++;
        }
        
        for (let i = 0; i < array.length; i++) {
            bars[startIdx + i].classList.remove("compare");
            bars[startIdx + i].classList.add("sorted");
        }
        await sleep(speedFactor);
        
        return array;
    }
    // ^ Heap Sort (Additional)
    async function heapSort(array) {
    let bars = document.getElementsByClassName("bar");
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i, bars);
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];

        bars[0].style.height = array[0] * heightFactor + "px";
        bars[i].style.height = array[i] * heightFactor + "px";
        bars[i].classList.add("sorted");
        await sleep(speedFactor);

        await heapify(array, i, 0, bars);
    }
    bars[0].classList.add("sorted"); 
    return array;
    }

    async function heapify(array, n, i, bars) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        bars[i].classList.add("swapping");
        bars[largest].classList.add("swapping");

        [array[i], array[largest]] = [array[largest], array[i]];

        bars[i].style.height = array[i] * heightFactor + "px";
        bars[largest].style.height = array[largest] * heightFactor + "px";
        await sleep(speedFactor);

        bars[i].classList.remove("swapping");
        bars[largest].classList.remove("swapping");

        await heapify(array, n, largest, bars);
    }
    }
//? Initialize the visualizer
init();
});
