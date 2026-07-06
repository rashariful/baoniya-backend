import mongoose from "mongoose";

class QueryBuilder {
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // =========================
  // SEARCH
  // =========================
  search(searchableFields = []) {
    const { searchTerm } = this.query;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }

    return this;
  }

  // =========================
  // DATE RANGE
  // =========================
  range(dateField = "createdAt") {
    const { startRange, endRange } = this.query;

    if (startRange || endRange) {
      const rangeFilter = {};

      if (startRange) {
        rangeFilter.$gte = new Date(startRange);
      }

      if (endRange) {
        const endDate = new Date(endRange);
        endDate.setHours(23, 59, 59, 999);

        rangeFilter.$lte = endDate;
      }

      this.modelQuery = this.modelQuery.find({
        [dateField]: rangeFilter,
      });
    }

    return this;
  }

  // =========================
  // FILTER
  // =========================
  filter() {
    const queryObject = { ...this.query };

    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "startRange",
      "endRange",
      "minPrice",
      "maxPrice",
    ];

    excludeFields.forEach((el) => delete queryObject[el]);

    const filter = {};

    // =========================
    // NORMAL FILTER
    // =========================
    Object.keys(queryObject).forEach((key) => {
      const value = queryObject[key];

      // ObjectId support
      if (mongoose.Types.ObjectId.isValid(value)) {
        filter[key] = new mongoose.Types.ObjectId(value);
      } else {
        filter[key] = value;
      }
    });

    // =========================
    // PRICE FILTER
    // =========================
    if (this.query.minPrice || this.query.maxPrice) {
      filter.price = {};

      if (this.query.minPrice) {
        filter.price.$gte = Number(this.query.minPrice);
      }

      if (this.query.maxPrice) {
        filter.price.$lte = Number(this.query.maxPrice);
      }
    }

    // =========================
    // BOOLEAN FILTER
    // =========================
    Object.keys(filter).forEach((key) => {
      if (filter[key] === "true") filter[key] = true;
      if (filter[key] === "false") filter[key] = false;
    });

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  // =========================
  // SORT
  // =========================
  sort() {
    const sort =
      this?.query?.sort?.split(",").join(" ") || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  // =========================
  // PAGINATION
  // =========================
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 500;

    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // =========================
  // LIMIT
  // =========================
  limit() {
    const limit = Number(this?.query?.limit) || 500;

    this.modelQuery = this.modelQuery.limit(limit);

    return this;
  }

  // =========================
  // SELECT FIELDS
  // =========================
  fields() {
    const fields =
      this?.query?.fields?.split(",").join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  // =========================
  // POPULATE
  // =========================
  populate(populateOptions) {
    if (populateOptions) {
      this.modelQuery = this.modelQuery.populate(populateOptions);
    }

    return this;
  }

  // =========================
  // COUNT TOTAL
  // =========================
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();

    const total = await this.modelQuery.model.countDocuments(
      totalQueries
    );

    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 500;

    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export default QueryBuilder;

// class QueryBuilder {
//   constructor(modelQuery, query) {
//     this.modelQuery = modelQuery;
//     this.query = query;
//   }

//   //   search query
//   // this is testing shariful

//   // search(searchableFields = []) {
//   //   const { searchTerm } = this.query;
  
//   //   if (!searchTerm) return this;
  
//   //   const searchRegex = new RegExp(searchTerm, "i");
  
//   //   const lookups = new Set(); // To avoid duplicate lookups
//   //   const orConditions = [];
  
//   //   for (const field of searchableFields) {
//   //     if (field.includes(".")) {
//   //       const [ref, nestedField] = field.split(".");
  
//   //       // Add lookup if not already added
//   //       if (!lookups.has(ref)) {
//   //         this.aggregationPipeline.push(
//   //           {
//   //             $lookup: {
//   //               from: `${ref}s`, // assumes pluralized collection name like 'products', 'users'
//   //               localField: ref,
//   //               foreignField: "_id",
//   //               as: ref
//   //             }
//   //           },
//   //           {
//   //             $unwind: {
//   //               path: `$${ref}`,
//   //               preserveNullAndEmptyArrays: true // if the reference may be missing
//   //             }
//   //           }
//   //         );
//   //         lookups.add(ref);
//   //       }
  
//   //       orConditions.push({ [field]: { $regex: searchRegex } });
//   //     } else {
//   //       orConditions.push({ [field]: { $regex: searchRegex } });
//   //     }
//   //   }
  
//   //   if (orConditions.length > 0) {
//   //     this.aggregationPipeline.push({
//   //       $match: {
//   //         $or: orConditions
//   //       }
//   //     });
//   //   }
  
//   //   return this;
//   // }
  


//   // ses akhane amar sharif 
//   search(searchableFields) {
//     const { searchTerm } = this.query;
  
//     if (searchTerm) {
//       const searchRegex = new RegExp(searchTerm, "i");
  
//       this.modelQuery = this.modelQuery.find({
//         $or: searchableFields.map((field) => {
//           // Apply regex search only for string fields
//           return typeof field === "string"
//             ? { [field]: searchRegex }
//             : { [field]: searchTerm };
//         }),
//       });
//     }
  
//     return this;
//   }
  





//   // this line sheam created
//   // search(searchableFields) {
//   //   const { searchTerm } = this.query;

//   //   if (searchTerm) {
//   //     const searchRegex = new RegExp(searchTerm, "i");
//   //     this.modelQuery = this.modelQuery.find({
//   //       $or: searchableFields.map((field) => ({ [field]: searchRegex })),
//   //     });
//   //   }

//   //   return this;
//   // }

//   // range query
//   range(dateField = "createdAt") {
//     const startRange = this.query.startRange;
//     const endRange = this.query.endRange;
  
//     if (startRange || endRange) {
//       const rangeFilter = {};
  
//       if (startRange) {
//         rangeFilter.$gte = new Date(startRange);
//       }
  
//       if (endRange) {
//         // Include the full day up to 23:59:59.999
//         const endDate = new Date(endRange);
//         endDate.setHours(23, 59, 59, 999);
//         rangeFilter.$lte = endDate;
//       }
  
//       this.modelQuery = this.modelQuery.find({
//         [dateField]: rangeFilter,
//       });
//     }
  
//     return this;
//   }
  
//   // range(searchableFields) {
//   //   const startRangeField = searchableFields?.startDateField || "createdAt";
//   //   const endRangeField = searchableFields?.endDateField || "createdAt";
//   //   const startRange = this?.query?.startRange;
//   //   const endRange = this?.query?.endRange;

//   //   if (startRange && endRange) {
//   //     this.modelQuery = this.modelQuery.find({
//   //       [startRangeField]: { $gte: startRange },
//   //       [endRangeField]: { $lte: endRange },
//   //     });
//   //   } else if (startRange) {
//   //     this.modelQuery = this.modelQuery.find({
//   //       [startRangeField]: { $gte: startRange },
//   //     });
//   //   } else if (endRange) {
//   //     this.modelQuery = this.modelQuery.find({
//   //       [endRangeField]: { $lte: endRange },
//   //     });
//   //   }
//   //   return this;
//   // }

//   //   filter query
//   // filter() {
//   //   const queryObject = { ...this.query };
//   //   // remove fields from query
//   //   const excludeFields = [
//   //     "searchTerm",
//   //     "sort",
//   //     "limit",
//   //     "page",
//   //     "fields",
//   //     "startRange",
//   //     "endRange",
//   //   ];

//   //   excludeFields.forEach((el) => delete queryObject[el]);

//   //   this.modelQuery = this.modelQuery.find(queryObject);
//   //   return this;
//   // }



//   async filter() {
//   const queryObject = { ...this.query };

//   const excludeFields = [
//     "searchTerm",
//     "sort",
//     "limit",
//     "page",
//     "fields",
//     "startRange",
//     "endRange",
//     "minPrice",
//     "maxPrice",
//   ];

//   excludeFields.forEach((el) => delete queryObject[el]);

//   const filter = {};

//   // PRICE FILTER
//   if (this.query.minPrice || this.query.maxPrice) {
//     filter.price = {};

//     if (this.query.minPrice) {
//       filter.price.$gte = Number(this.query.minPrice);
//     }

//     if (this.query.maxPrice) {
//       filter.price.$lte = Number(this.query.maxPrice);
//     }
//   }

//   // NORMAL FILTERS
//   Object.keys(queryObject).forEach((key) => {
//     filter[key] = queryObject[key];
//   });

//   // CATEGORY SLUG FILTER
//   if (this.query.category) {
//     const category = await Category.findOne({
//       slug: this.query.category,
//     });

//     if (category) {
//       filter.category = category._id;
//     }
//   }

//   // BRAND SLUG FILTER
//   if (this.query.brand) {
//     const brand = await Brand.findOne({
//       slug: this.query.brand,
//     });

//     if (brand) {
//       filter.brand = brand._id;
//     }
//   }

//   // SUPPLIER SLUG FILTER
//   if (this.query.supplier) {
//     const supplier = await Supplier.findOne({
//       slug: this.query.supplier,
//     });

//     if (supplier) {
//       filter.supplier = supplier._id;
//     }
//   }

//   this.modelQuery = this.modelQuery.find(filter);

//   return this;
// }


// // OLD VERSIN OF FIILTER 

// // filter() {
// //   const queryObject = { ...this.query };

// //   const excludeFields = [
// //     "searchTerm",
// //     "sort",
// //     "limit",
// //     "page",
// //     "fields",
// //     "startRange",
// //     "endRange",
// //     "minPrice",
// //     "maxPrice",
// //   ];

// //   excludeFields.forEach((el) => delete queryObject[el]);

// //   const filter = { ...queryObject };

// //   // ========================
// //   // PRICE FILTER FIX
// //   // ========================
// //   if (this.query.minPrice || this.query.maxPrice) {
// //     filter.price = {};

// //     if (this.query.minPrice) {
// //       filter.price.$gte = Number(this.query.minPrice);
// //     }

// //     if (this.query.maxPrice) {
// //       filter.price.$lte = Number(this.query.maxPrice);
// //     }
// //   }

// //   this.modelQuery = this.modelQuery.find(filter);

// //   return this;
// // }







//   //   sort query
//   sort() {
//     const sort = this?.query?.sort?.split(",").join(" ") || "-createdAt";
//     this.modelQuery = this.modelQuery.sort(sort);
//     return this;
//   }

//   //   limit query
//   limit() {
//     const limit = Number(this?.query?.limit) || 500;
//     this.modelQuery = this.modelQuery.limit(limit);
//     return this;
//   }

//   // pagination query
//   paginate() {
//     const page = Number(this?.query?.page) || 1;
//     const limit = Number(this?.query?.limit) || 500;
//     const skip = (page - 1) * limit;
//     this.modelQuery = this.modelQuery.skip(skip).limit(limit);
//     return this;
//   }

//   // field limiting
//   fields() {
//     const fields = this?.query?.fields?.split(",").join(" ") || "-__v";
//     this.modelQuery = this.modelQuery.select(fields);
//     return this;
//   }

//   async countTotal() {
//     const totalQueries = this.modelQuery.getFilter();

//     const total = await this.modelQuery.model.countDocuments(totalQueries);
//     const page = Number(this?.query?.page) || 1;
//     const limit = Number(this?.query?.limit) || 500;
//     const totalPages = Math.ceil(total / limit);
//     return {
//       total,
//       page,
//       limit,
//       totalPages,
//     };
//   }
// }

// export default QueryBuilder;
