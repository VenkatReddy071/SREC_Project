class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filterQuery = {};
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'searchTerm', 'priceLevels', 'cuisines','rating'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.filterQuery = JSON.parse(queryStr);

    if (this.queryString.searchTerm) {
      const searchRegex = new RegExp(this.queryString.searchTerm, 'i');
      if (!this.filterQuery.$and) this.filterQuery.$and = [];
      this.filterQuery.$and.push({
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      });
    }

    if (this.queryString.priceLevels) {
      const selectedLevels = this.queryString.priceLevels.split(',');
      const priceRangeQueries = [];

      if (selectedLevels.includes('$')) priceRangeQueries.push({ averagePriceINR: { $lte: 300 } });
      if (selectedLevels.includes('$$')) priceRangeQueries.push({ averagePriceINR: { $gt: 300, $lte: 800 } });
      if (selectedLevels.includes('$$$')) priceRangeQueries.push({ averagePriceINR: { $gt: 800 } });

      if (priceRangeQueries.length > 0) {
        if (!this.filterQuery.$and) this.filterQuery.$and = [];
        this.filterQuery.$and.push({ $or: priceRangeQueries });
      }
    }
    
    if (this.queryString.cuisines) {
        console.log(this.queryString.cuisines)
        if (!this.filterQuery.$and) this.filterQuery.$and = [];
        this.filterQuery.$and.push({ cuisine: { $in: this.queryString.cuisines.split(',') } });
    }
    if(this.queryString.rating){
        console.log(this.queryString.rating);
        if (!this.filterQuery.$and) this.filterQuery.$and = [];
        this.filterQuery.$and.push({ rating: { $gte:this.queryString.rating } });
    }
    if (this.queryString.services) {
        console.log(this.queryString.services)
        const selectedServices = this.queryString.services.split(',');
        if (selectedServices.length > 0) {
            if (!this.filterQuery.$and) this.filterQuery.$and = [];
            this.filterQuery.$and.push({ services: { $in: selectedServices } });
        }
    }

    this.query = this.query.find(this.filterQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
        let sortBy = this.queryString.sort.split(',').join(' ');

        if (sortBy === 'takeaway-first') sortBy = '-isTakeaway createdAt';
        if (sortBy === 'dine-in-first') sortBy = '-services';

        this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 30;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;