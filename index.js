var dataset;
var toMake = "at1";


d3.text('https://raw.githubusercontent.com/kiranbandi/synvisio/master/build/assets/files/at_coordinate.gff').
then(function(d){
    var result = "chromosome\tgene\tstart\tend\n" + d;
    dataset = d3.tsvParse(result)
    // console.log(dataset)
    generateVisualization()
}) 

var window = 50000

function generateVisualization() {
    
    var slider = document.getElementById("myRange");
    var output = document.getElementById("range");
    output.innerHTML = slider.value;
    slider.oninput = function() {
        output.innerHTML = this.value;
        d3.select('.svgShower').remove();
        generateVisualization();
        
      }


    var currentChromosome = dataset[0].chromosome
    var chromosomeSorted = {[currentChromosome]: []};


    for (gene of dataset){
        if (gene.chromosome == currentChromosome){

            chromosomeSorted[currentChromosome].push([gene.start, gene.end])

        }else{
            currentChromosome = gene.chromosome
            chromosomeSorted[currentChromosome] = [[gene.start, gene.end]]

        }
    }

    
    var chromDrawarray = {};

    for (chromosome of Object.keys(chromosomeSorted)){
        var dataChrom = chromosomeSorted[chromosome]
        var m = [].concat.apply([], dataChrom);

        
        var upperLimit = String(Math.max.apply(null, m));
        var currentBase = String(Math.min.apply(null, m));



        var rangeCoord = Math.floor((upperLimit - currentBase)/slider.value)



        chromDrawarray[chromosome]  = new Array(rangeCoord+1).fill(0)

        for (coords of dataChrom){
            low = Math.floor((coords[0]-currentBase)/slider.value)
            high= Math.floor((coords[1]-currentBase)/slider.value)

            if (high>chromDrawarray[chromosome].length){

            }
            for (let i = low; i <= high; i++){

                chromDrawarray[chromosome][i]+=1
            }
        }
    }

    var cNum =  0

    

    arr = Object.values(chromDrawarray)
    var merged = [].concat.apply([], arr);
    var max = Math.max.apply(null, merged);
    var min = Math.min.apply(null, merged);
    
    
    var colorScale = d3.scaleLinear()
    .domain([min,max])

    .range([0, 255]);
        
   
    d3.select('body').append('div').attr("class","svgShower")
    for (chromosome of Object.keys(chromDrawarray)){
        
        cNum++;

        numGenes = chromDrawarray[chromosome]

        
        // var dataset = numGenes
        var w = '250',
            h = '100';
            
    
        //Create SVG element 
        

        var svg = d3.select(".svgShower").append("svg").attr("width", w).attr("height", h).attr("id",chromosome).on("click",function(){

            makeBigChrom(this.id, chromDrawarray, colorScale);
            toMake = this.id
        })
        svg.chrom = chromosome;
        d3.select(".svgShower").append("text")
        .text("      ");

        makeMap(numGenes, w, chromosome,svg,colorScale, 50);
            
    }
    makeBigChrom(toMake, chromDrawarray, colorScale)

    
}

function makeBigChrom(chromosome, chromDrawarray, colorScale){
    d3.select('.chromosomeShower').remove();

    d3.select('body').append('div').attr("class","chromosomeShower");
    var svg2 = d3.select(".chromosomeShower").append("svg").attr("width", 1275).attr("height", 200);
    // console.log(svg)
    makeMap(chromDrawarray[chromosome], 1275, chromosome,svg2,colorScale,75);


}

function makeMap(n, wid, chromo,svg,colorScale, h){
    var data_length = n.length;

    var xScale = d3.scaleLinear()
            .domain([0, data_length - 1])
            .range([0, wid]);
    

    

    svg.selectAll("rect").data(n).enter().append("rect")
            .attr("x", function(d, i) {
                return xScale(i);
            }).attr("y", function(d) {
                return 50;
            }) //move away from top 	
            .attr("width", wid/ n.length)
            .attr("height", function(d) {
                return h;
            })
            .attr("fill", function(d) {

                return "rgb(" + colorScale(d) + ",0,0)";
                
            }).append("svg:title")
            .text(function(d) { return chromo; });

}