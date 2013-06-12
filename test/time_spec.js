var assert = require("assert"),
    time = require("../lib/Time");

var Time = time.Time, Period = time.Period;

var tAM = new Time("12:00 AM"), tPM = new Time("12:00 PM"),
    t1AM = new Time("12:01 AM"), t1PM = new Time("12:01 PM");

describe('Time', function(){
  describe('constructor', function(){
    it('should initialize 12:00 AM to 0 seconds', function(){
      assert.equal(new Time("12:00 AM").value, 0);
    });
    it('should initialize 12:00 PM to 4320 seconds', function(){
      assert.equal(new Time("12:00 PM").value, 4320);
    });
    it('should initialize 12:01 AM to 60 seconds', function(){
      assert.equal(new Time("12:01 AM").value, 60);
    });
    it('should initialize 12:01 PM to 4380 seconds', function(){
      assert.equal(new Time("12:01 PM").value, 4380);
    });
  });

  describe('toString', function(){
    it('should print 12:00 PM', function(){
      assert.equal(new Time("12:00 PM").toString(), "12:00 PM");
    });
  });

  describe('gt', function(){
    it('12:00 PM should be greater than 12:00 AM', function(){
      assert(new Time("12:00 PM").gt(new Time("12:00 AM")));
    });
  });

  describe('gte', function(){
    it('12:00 PM should be greater than 12:00 AM', function(){
      assert(new Time("12:00 PM").gte(new Time("12:00 AM")));
    });

    it('12:00 PM should be equal to 12:00 PM', function(){
      assert(new Time("12:00 PM").gte(new Time("12:00 PM")));
    });
  });

  describe('lt', function(){
    it('12:00 AM should be less than 12:00 PM', function(){
      assert(new Time("12:00 AM").lt(new Time("12:00 PM")));
    });
  });

  describe('lte', function(){
    it('12:00 AM should be less than 12:00 PM', function(){
      assert(new Time("12:00 AM").lte(new Time("12:00 PM")));
    });
    it('12:00 PM should be equal to 12:00 PM', function(){
      assert(new Time("12:00 PM").lte(new Time("12:00 PM")));
    });
  });

  describe('eq', function(){
    it('12:00 PM should be equal to 12:00 PM', function(){
      assert(new Time("12:00 PM").eq(new Time("12:00 PM")));
    });
  });
});

describe('Period', function(){
  describe('constructor', function(){
   it('should initialize from correctly', function(){
      assert.equal(new Period(t1AM, tPM).from, t1AM);
   });
   it('should initialize to correctly', function(){
      assert.equal(new Period(t1AM, tPM).to, tPM);
   });
  });

  describe('contains', function(){
   it('should evaluate true', function(){
      assert(new Period(tAM, tPM).contains(t1AM));
   });
   it('should evaluate false', function(){
      assert(new Period(t1AM, tPM).contains(t1AM));
   });
  });

  describe('overlaps', function(){
   it('should evaluate true', function(){
      assert(new Period(tAM, tPM).overlaps(new Period(tAM, tPM)));
   });
   it('should evaluate true', function(){
      assert(new Period(t1AM, tPM).overlaps(new Period(tAM, tPM)));
   });
   it('should evaluate false', function(){
      assert(new Period(tAM, tPM).overlaps(new Period(t1PM, new Time("2:00 PM"))));
   });
  });
});