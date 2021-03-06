/**
 * BioJS packages handler.
 * Created by AK on 11/20/2015.
 */

// Load packages
var fs = require("fs");
var npmKeyword = require('npm-keyword');
var packageJson = require("package-json");

var Retriever = require("./Retriever");

/**
 * @constructor
 */
var BioJSPackages = function () {
    Retriever.call(this, "biojs");
};

BioJSPackages.prototype = Object.create(Retriever.prototype);
BioJSPackages.constructor = BioJSPackages;

/**
 * Retrieves packages from npmjs.com using npm-keyword and stores as a JSON file in OUTFILE_DIRECTORY.
 */
BioJSPackages.prototype.retrieve = function (callback) {
    var BASE_URL = "https://www.npmjs.com/package/";

    var outfile = this.getNewFile();
    var base = this; // Declare for reference within closure scopes
    npmKeyword('biojs').then(function (biojsPackages) {
        console.log(biojsPackages.length + " packages found.");
        var data = [];
        for (var i = 0; i < biojsPackages.length; i++) {
            var pkg_name = biojsPackages[i]["name"];
            console.log("Retrieving " + pkg_name);

            // Retrieve json format
            packageJson(pkg_name, "latest").then(function (jsonPackage) {
                var pkg = {};
                pkg.sourceID = jsonPackage.name; // Use name as ID
                pkg.name = jsonPackage.name;
                pkg.version = [jsonPackage.version];
                pkg.description = jsonPackage.description;

                if ("author" in jsonPackage) {
                    pkg.authors = [jsonPackage.author.name];
                    pkg.authorEmails = [jsonPackage.author.email];
                }
                pkg.tags = jsonPackage.keywords;
                pkg.sourceCodeURL = jsonPackage.repository.url;
                pkg.linkDescriptions = ["Homepage", "Documentation", "Bugs"];
                pkg.linkUrls = [BASE_URL + jsonPackage.name, jsonPackage.homepage, jsonPackage.bugs.url];
                pkg.types = ["Widget"];
                pkg.platforms = ["Web UI"];
                pkg.languages = ["JavaScript"];
                pkg.logo = "http://biojs.net/img/logo.png";

                pkg.licenses = [];
                pkg.licenseUrls = [];
                for (var l = 0; l < jsonPackage.licenses; l++) {
                    pkg.licenses.push(jsonPackage.licenses[l].type);
                    pkg.licenseUrls.push(jsonPackage.licenses[l].url);

                }

                pkg.dependencies = [];
                for (var k in jsonPackage.dependencies) {
                    pkg.dependencies.push(k + ": " + jsonPackage.dependencies[k]);
                }

                pkg.maintainers = [];
                pkg.maintainerEmails = [];

                for (var j = 0; j < jsonPackage.maintainers.length; j++) {
                    pkg.maintainers.push(jsonPackage.maintainers[j].name);
                    pkg.maintainerEmails.push(jsonPackage.maintainers[j].email);
                }

                pkg.source = "Biojs";
                pkg.tags = [];
                pkg.domains = [];

                var keywords = jsonPackage.keywords;
                // Hacky way to match biological domain
                if (keywords.indexOf("Medical") >= 0) {
                    pkg.domains.push("Medical");
                }

                if (keywords.indexOf("proteome") >= 0 || keywords.indexOf("proteomics") >= 0 || keywords.indexOf("proteomic") >= 0 || keywords.indexOf("protein") >= 0 || keywords.indexOf("proteins") >= 0) {
                    pkg.domains.push("Proteomics");
                }

                if (keywords.indexOf("genome") >= 0 || keywords.indexOf("genomic") >= 0 || keywords.indexOf("genomics") >= 0 || keywords.indexOf("genes") >= 0 || keywords.indexOf("dna") >= 0 || keywords.indexOf("rna") >= 0 || keywords.indexOf("plasmid") >= 0 || keywords.indexOf("rna-seq") >= 0) {
                    pkg.domains.push("Genomics");
                }

                if (keywords.indexOf("metabolome") >= 0 || keywords.indexOf("metabolomic") >= 0 || keywords.indexOf("metabolomics") >= 0 || keywords.indexOf("metabolite") >= 0 || keywords.indexOf("metabolites") >= 0) {
                    pkg.domains.push("Metabolomics");
                }

                if (keywords.indexOf("metagenomic") >= 0 || keywords.indexOf("metagenomics") >= 0) {
                    pkg.domains.push("Metagenomics");
                }

                if (keywords.indexOf("Medical") >= 0 || keywords.indexOf("biomedical") >= 0) {
                    pkg.domains.push("Biomedical");
                }

                // Remove certain keywords
                var biojs_index = keywords.indexOf("biojs");
                var proteomic_index = keywords.indexOf("proteomics");
                var proteomics_index = keywords.indexOf("proteomic");
                var genomic_index = keywords.indexOf("genomic");
                var genomics_index = keywords.indexOf("genomics");
                var metabolomic_index = keywords.indexOf("metabolomic");
                var metabolomics_index = keywords.indexOf("metabolomics");
                var metagenomic_index = keywords.indexOf("metagenomic");
                var metagenomics_index = keywords.indexOf("metagenomics");
                var biomedical_index = keywords.indexOf("biomedical");

                if (biojs_index >= 0) {
                    keywords.splice(biojs_index, 1);
                }

                if (proteomic_index >= 0) {
                    keywords.splice(proteomic_index, 1);
                }

                if (proteomics_index >= 0) {
                    keywords.splice(proteomics_index, 1);
                }

                if (genomic_index >= 0) {
                    keywords.splice(genomic_index, 1);
                }

                if (genomics_index >= 0) {
                    keywords.splice(genomics_index, 1);
                }

                if (metabolomic_index >= 0) {
                    keywords.splice(metabolomic_index, 1);
                }

                if (metabolomics_index >= 0) {
                    keywords.splice(metabolomics_index, 1);
                }

                if (metagenomic_index >= 0) {
                    keywords.splice(metagenomic_index, 1);
                }

                if (metagenomics_index >= 0) {
                    keywords.splice(metagenomics_index, 1);
                }

                if (biomedical_index >= 0) {
                    keywords.splice(biomedical_index, 1);
                }

                pkg.tags = keywords;

                // Append to data
                if (pkg.name != null) {
                    data.push(pkg);
                }

                // Write to file when last package has been retrieved
                if (data.length == biojsPackages.length) {

                    // Write closing brackets and braces
                    fs.appendFileSync(base.OUTFILE_TEMP_DIRECTORY + outfile, JSON.stringify(data));

                    // Move file out of temp directory when complete
                    fs.renameSync(base.OUTFILE_TEMP_DIRECTORY + outfile, base.OUTFILE_DIRECTORY + outfile);
                    console.log("Complete: " + outfile);

                    // Execute callback
                    // callback(null, outfile);
                }
            });
        }
    });

    return "Retrieving " + outfile;
};

module.exports = BioJSPackages;
