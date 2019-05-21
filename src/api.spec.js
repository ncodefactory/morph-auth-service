import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { name, version } from '../package.json';
import { moduleName, moduleVersion } from './app-info';
import { apiVersion, urlForInfo } from './router';
import api from './api';

const should = chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe(name, () => {
  describe('moduleVersion', () => {
    it('is correct', () => {
      expect(moduleVersion).to.equal(version);
    });
  });
  describe('moduleName', () => {
    it('is correct', () => {
      expect(moduleName).to.equal(name);
    });
  });
  describe('routes : index', () => {
    describe('GET /', () => {
      it('should return JSON with status, service name and service version info', (done) => {
        chai
          .request(api)
          .get('/')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.equal('application/json');
            res.body.moduleName.should.equal(moduleName);
            res.body.moduleVersion.should.equal(moduleVersion);
            res.body.latestApiVersion.should.equal(apiVersion);
            res.body.urlForInfo.should.equal(urlForInfo);
            done();
          });
      });
    });
  });
});
